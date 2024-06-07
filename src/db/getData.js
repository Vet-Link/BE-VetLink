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
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
}

async function isEmailUnique(email) {
  const loginInfoCollection = db.collection('login-info');

  try {
    // Query for documents with the given email
    const snapshot = await loginInfoCollection.where('email', '==', email).get();

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
    console.error('Error checking email uniqueness:', error);
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
}

module.exports = {
  isUsernameUnique,
  isEmailUnique,
}