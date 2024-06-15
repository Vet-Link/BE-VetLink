const db = require("../db/initializeDB");
const jwt = require("jsonwebtoken");
const isTokenExpired = require("../service/jwtToken");

async function emailLinkVerificator(req, res) {
  const { userType, id, token } = req.params;
  try {
    let userSnapshot;

    if (userType === 'user') {
      // Find the user document based on the user's ID
      userSnapshot = await db.collection('login-info').doc(id).get();
    } else if (userType === 'doctor') {
      // Find the user document based on the user's ID
      userSnapshot = await db.collection('doctor-data').doc(id).get();
    } else {
      return res.status(400).send({ message: 'Invalid Link' });
    }

    if (!userSnapshot.exists) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    // Find the token document based on the user ID and token value
    const tokenSnapshot = await db.collection('verificationTokens')
      .where('ID', '==', id)
      .where('token', '==', token)
      .get();

    if (tokenSnapshot.empty) {
      return res.status(400).send({ message: 'Invalid Link' });
    }

    if(isTokenExpired(token)) {
      return res.status(403).send({ message: 'Token has expired' });
    }

    jwt.verify(token, process.env.SECRETKEY, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).send({ message: 'Token has expired' });
        }
        return res.status(403).send({ message: 'Invalid token'});
      }
    });

    // Update the user document to mark it as verified
    await db.collection('login-info').doc(req.params.id).update({ verified: true });

    // Delete the token document
    const documentRef = db.collection('verificationTokens').doc(req.params.id);
    documentRef.delete();

    res.status(200).send({ message: "Email verified successfully. Try logging in" });
  } catch (error) {
    console.error("Error verifying email link:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = emailLinkVerificator;