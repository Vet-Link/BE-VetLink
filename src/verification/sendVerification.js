const { Firestore } = require('@google-cloud/firestore');
const jwt = require("jsonwebtoken");
const sendEmail = require('./sendEmail');


const db = new Firestore({
  projectId: 'vetlink-425416',
  keyFilename: './service-key-firestore.json',
  databaseId: 'patient-db',
});

async function sendVerificationEmail(email, username, ID) {
    try {
        // Generate JWT Token
        const token = jwt.sign({ email: email, _id: ID }, process.env.SECRETKEY, { expiresIn: "1h" });
        
        // Save token to Firestore
        await db.collection('verificationTokens').doc(ID).set({ ID, token });

        // Construct Verification URL
        const url = `http://localhost:8000/${ID}/verify/${token}`;
        
        // Compose Email Message
        const subject = "Please Verify Email";
        const message = `
            <h3>Hello ${username}</h3>
            <p>Thank you for registering for our services.</p>
            <p>Click <a href="${url}">here</a> to verify your email.</p>
        `;
        
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