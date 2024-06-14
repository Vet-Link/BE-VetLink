const { Firestore } = require('@google-cloud/firestore');
const jwt = require("jsonwebtoken");
const sendEmail = require('../service/sendEmail');
//const db = require('../db/initializeDB');
const verificationMessage = require('./emailMessage');
const {storeVerificationTokens} = require('../db/storeData')

async function sendVerificationEmail(email, username, ID) {
    try {
        // Generate JWT Token
        const token = jwt.sign({ email: email, _id: ID }, process.env.SECRETKEY, { expiresIn: "1h" });
        
        // Save token to Firestore
        const createdAt = Firestore.FieldValue.serverTimestamp();
        const data = { createdAt, ID, token };


        await storeVerificationTokens(ID, data);
        //db.collection('verificationTokens').doc(ID).set({ createdAt, ID, token});

        // Construct Verification URL
        const url = `http://localhost:9000/${ID}/verify/${token}`;
        
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