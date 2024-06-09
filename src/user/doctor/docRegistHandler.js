const crypto = require('crypto');
const bcrypt = require("bcrypt");
const validator = require('validator');

const { storeDataRegis } = require("../../db/storeData");
const getGMT7Date = require("../../service/getGMT7Date");
const { isUsernameUnique, isEmailUnique } = require("../../db/getData");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, validatePassword } = require("../../service/characterChecker");
const sendVerificationEmail = require('../../verification/sendVerification');
const { validateImage } = require('../../service/fileChecker');
async function doctorRegistration(req, res) {
    const { username, email, password, passwordVerify } = req.body;
    const time = getGMT7Date();
    const ID = crypto.randomUUID();
    const isUsernameUniqueCheck = await isUsernameUnique(username);
    const isEmailUniqueCheck = await isEmailUnique(email);

    try {
        //check if the username is too short
        if(isUsernameTooShort(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username is too short',
            });
        }

        //check if the username is too long
        if(isUsernameTooLong(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username is too long',
            });
        }

        //check if the username has symbol
        if(isUsernameHasSymbol(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Usernames must not contain symbols',
            });
        }

        //Ensure there are no duplicated username in db
        if(!isUsernameUniqueCheck) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username already exists',
            });
        }

        //Email format validation
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                status: 'error',
                message: 'Email is not valid. Please try again!',
            });
        }

        //Ensure there are no duplicated email in db
        if(!isEmailUniqueCheck) {
            return res.status(409).json({
                status: 'fail',
                message: 'Email is already in use! try logging in',
            });
        }

        //password format validation
        try {
            validatePassword(password);
        } catch (error) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }

        try {
            const filePath = 'path/to/your/image.jpg';
            validateImage(filePath);
            console.log('Image is valid');
        } catch (error) {
            console.error('Invalid image:', error.message);
        }

        //ensure you dont make a typo in password
        if(password !== passwordVerify) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password do not match',
            });
        }

        //if passed all the requirement
        const saltRounds = parseInt(process.env.SALT, 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const doctorData = {
            ID, username, email, hashedPassword, time,
        }
        //store user data
        await storeDataRegis(ID, doctorData);

        //send email verification
        const emailResult = await sendVerificationEmail(email, username, ID);

        return res.status(200).json({
            status: 'success',
            message: 'Data sucessfully registered. ' + emailResult.message,
        });
        

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Failed to receive data from the frontend',
            error: error.message,
        });
    }
};

module.exports = {
    doctorRegistration,
}