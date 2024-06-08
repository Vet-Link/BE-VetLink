const message = require("../verification/emailMassage");
const db = require("./initializeDB");

async function isUsernameUnique(username) {
  const loginInfoCollection = db.collection('login-info');

  try {
    // Query for documents with the given username
    const snapshot = await loginInfoCollection.where('username', '==', username).get();

    snapshot.forEach(doc => {
      //console.log(doc.id, '=>', doc.data());
    });

    //if unique
    if (snapshot.empty) {
      return true;
    } 

    //if duplicated
    return false;
  } catch (error) {
    console.error('Error checking username uniqueness:', error);
    throw error;
  }
}

async function isEmailUnique(email) {
  const loginInfoCollection = db.collection('login-info');

  try {
    // Query for documents with the given email
    const snapshot = await loginInfoCollection.where('email', '==', email).get();

    //if unique
    if (snapshot.empty) {
      return true;
    } 

    //if duplicated
    return false;
  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    throw error;
  }
}

async function searchDataByEmail(email) {
  const loginInfoCollection = db.collection('login-info');

  try {
    const snapshot = await loginInfoCollection.where('email', '==', email).get();

    //if there is no email found
    if (snapshot.empty) {
      const msg = "User not found";
      return msg;
    }

    let user;
    snapshot.forEach(doc => {
      user = doc.data();
    });

    return user;
  } catch (error) {
    console.error('Error finding data by email:', error);
    throw error;
  }
}

module.exports = {
  isUsernameUnique,
  isEmailUnique,
  searchDataByEmail,
}