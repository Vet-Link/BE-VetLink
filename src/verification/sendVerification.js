const jwt = require("jsonwebtoken");
const sendEmail = require('./sendEmail');
const message = require('./emailMassage');
const db = require('../db/initializeDB');

async function sendVerificationEmail(email, username, ID) {
    try {
        // Generate JWT Token
        const token = jwt.sign({ email: email, _id: ID }, process.env.SECRETKEY, { expiresIn: "1h" });
        
        // Save token to Firestore
        await db.collection('verificationTokens').doc(ID).set({ ID, token });

        // Construct Verification URL
        const url = `http://localhost:8000/${ID}/verify/${token}`;
        
        // Compose Email Message
        const subject = "Please Verify Your Email From VetLink";
        message(username, url);
        
        // Send Email (you need to implement this function)
        await sendEmail(email, subject, message);

        // Send Response
        return { success: true, message: "An email has been sent to your account. Please check your inbox." };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Failed to send verification email." };
    }
}

module.exports = sendVerificationEmail;