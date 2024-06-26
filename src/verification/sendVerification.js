const { Firestore } = require('@google-cloud/firestore');
const jwt = require("jsonwebtoken");
const sendEmail = require('../service/sendEmail');
const verificationMessage = require('./emailMessage');
const {storeVerificationTokens} = require('../db/storeData')

async function sendVerificationEmail(userType, email, username, ID) {
    try {
        // Generate JWT Token
        const token = jwt.sign({ email: email, _id: ID }, process.env.SECRETKEY, { expiresIn: "3m" });
        
        // Save token to Firestore
        const createdAt = Firestore.FieldValue.serverTimestamp();
        const data = { createdAt, ID, token };

        await storeVerificationTokens(ID, data);

        // Construct Verification URL
        const url = `${process.env.BE_URL}/verify/${userType}/${ID}/${token}`;
        
        // Compose Email Message
        const subject = "Please Verify Your Email From VetLink";
        const emailMessage = verificationMessage(username, url);
        
        // Send Email
        await sendEmail(email, subject, emailMessage);

        // Send Response
        return { success: true, message: "An email has been sent to your account. Please check your inbox." };
    } catch (error) {
        console.error("Error sending verification email:", error);
        //throw error;
        return { success: false, message: "Failed to send verification email." };
    } 
}

module.exports = sendVerificationEmail;