const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { isEmailUnique, getLatestVerificationCodeByEmail, getLatestUserDataByEmail } = require("../db/getData");
const db = require('../db/initializeDB');
const sendEmail = require('../service/sendEmail');
const resetPwMessage = require('./emailMessage');
const { validatePassword } = require('../service/characterChecker');

async function userResetPasswordReq(req, res) {
    const { email } = req.body;
    const isEmailUniqueCheck = await isEmailUnique(email);
    const date = new Date();
    const createdAt = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + 7 * 60 * 60000).toISOString();

    try {
        //Email format validation
        if (!validator.isEmail(email)) {
            return res.status(400).send({status: 'error',message: 'Email is not valid. Please try again!',});
        }

        //Ensure the email entered is correct email
        if(isEmailUniqueCheck) {
            return res.status(409).json({status: 'fail',message: 'Email not found',});
        }

        // Generate JWT Token
        const token = jwt.sign({ email: email, _id: ID }, process.env.SECRETKEY, { expiresIn: "3m" });

        // Generate random 6 digit code
        const verificationCode = generateRandomCode();
        const saltRounds = parseInt(process.env.SALT, 10);
        const hashedVerificationCode = await bcrypt.hash(verificationCode, saltRounds);
        await db.collection('forgot-password').doc(email).set({ createdAt, email, hashedVerificationCode, token});

        // Compose Email Message
        const subject = "VetLink Verification code for your password reset";
        const emailMessage = resetPwMessage(verificationCode);

        // Send Email
        await sendEmail(email, subject, emailMessage);

        return res.status(200).json({
            status: 'success',
            message: 'A verification code email has been sent to your account. Please check your inbox.',
            email: email,
        });
    } catch (error) {
        console.error("Error sending password reset verification code email:", error);
        return { success: false, message: "Failed to send password reset verification code email." };
    }
}

async function userResetPasswordVerification(req, res) {
    const { email, verificationCode } = req.body;

    try {
        const userData = await getLatestUserDataByEmail(email);
        const userId = userData.ID;
        const verificationCodeData = await getLatestVerificationCodeByEmail(email);

        //check if the verification code has expired
        if(isTokenExpired(verificationCodeData.token)) {
            // Delete the token document
            const documentRef = db.collection('forgot-password').doc(email);
            documentRef.delete();
          return res.status(403).send({ message: 'Verification failed, varification code has already expired' });
        }

        //check verification code
        const validPassword = await bcrypt.compare(verificationCode, verificationCodeData.hashedVerificationCode);
        if (!validPassword) {
            return res.status(403).send({status: 'error',message: 'Verification failed, Wrong code entered.',});
        }

        // Update the user document to mark it to be allowed to do password reset
        await db.collection('login-info').doc(userId).update({ passwordReset: true });

        return res.status(200).send({ status: 'success',message: "Password change request accepted" }); 
    } catch (error) {
        res.status(500).send({message: 'internal server error' + error.message,})
    }
}

async function userResetPasswordInput(req, res) {
    const { email, password, passwordVerify } = req.body;

    try {
        const userData = await getLatestUserDataByEmail(email);
        const isUserAllowedToChangePassword = userData.passwordReset;
        const userId = userData.ID;

        if (!isUserAllowedToChangePassword) {
            return res.status(401).send({status: 'error',message: 'Current email do not have permission to change the password.',});
        }

        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({status: 'fail',message: error.message,});
        }

        if(password !== passwordVerify) {
            return res.status(400).json({status: 'fail',message: 'Password do not match',});
        }

        //if passed all the requirement
        const saltRounds = parseInt(process.env.SALT, 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.collection('login-info').doc(userId).update({ hashedPassword: hashedPassword, passwordReset: false});

        return res.status(200).json({status: 'success',message: 'Password succesfully changed',});

    } catch (error) {
        res.status(400).json({status: 'fail',message: 'Failed to receive data from the frontend',error: error.message,});
    }
}

function generateRandomCode() {
  // Generate a random number between 100000 and 999999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return randomNumber.toString();
}

module.exports = {
    userResetPasswordReq,
    userResetPasswordVerification,
    userResetPasswordInput,
}