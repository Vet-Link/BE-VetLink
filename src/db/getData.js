const db = require("./initializeDB");

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

async function getLatestUserDataByEmail(email) {
  const Collection = db.collection('login-info');

  try {
    const snapshot = await Collection
    .where('email', '==', email)
    .get()

  if (snapshot.empty) {
    const msg = "No email found";
    return msg;
  }

  let latestData;
  snapshot.forEach(doc => {
    latestData = doc.data();
  });

  return latestData;

  } catch (error) {
    console.error('Error getting latest data for current email:', error);
    throw error;
  }
}

async function getLatestVerificationCodeByEmail(email) {
  const Collection = db.collection('forgot-password');

  try {
    const snapshot = await Collection
    .where('email', '==', email)
    .get()

  if (snapshot.empty) {
    const msg = "No request for password reset for current email";
    return msg;
  }

  let latestData;
  snapshot.forEach(doc => {
    latestData = doc.data();
  });

  return latestData;
  } catch (error) {
    console.error('Error finding request for password reset for current email:', error);
    throw error;
  }
}

async function getAllPetById(ID) {
  const path = `login-info/${ID}/pet-data`;
  const petCollection = db.collection(path);

  try{
    const snapshot = await petCollection.get();

    if (snapshot.empty) {
      return [];
    }

    const data = [];
    snapshot.forEach(doc => {
      data.push({
        ...doc.data()
      });
    });

    return data;
  } catch (error) {
    console.error('Error finding pet data: ', error);
    throw error;
  }
}

module.exports = {
  isEmailUnique,
  searchDataByEmail,
  getLatestUserDataByEmail,
  getLatestVerificationCodeByEmail,
  getAllPetById,
}