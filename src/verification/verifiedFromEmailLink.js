const db = require("../db/initializeDB");

async function emailLinkVerificator(req, res) {
  try {
    // Find the user document based on the user's ID
    const userSnapshot = await db.collection('login-info').doc(req.params.id).get();
    if (!userSnapshot.exists) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    // Find the token document based on the user ID and token value
    const tokenSnapshot = await db.collection('verificationTokens')
      .where('ID', '==', req.params.id)
      .where('token', '==', req.params.token)
      .get();

    if (tokenSnapshot.empty) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    // Update the user document to mark it as verified
    await db.collection('login-info').doc(req.params.id).update({ verified: true });

    // Delete the token document
    const documentRef = db.collection('verificationTokens').doc(req.params.id);
    documentRef.delete();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email link:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = emailLinkVerificator;