const { db, bucket } = require('./initializeDB');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Function to determine the collection based on user type
function getCollection(userType) {
  if (userType === 2) {
    return db.collection('doctor-data');
  } else if (userType === 3) {
    return db.collection('login-info');
  } else {
    throw new Error('Invalid user type');
  }
}

// Check if username is unique
async function isUsernameUnique(username, userType) {
  const collection = getCollection(userType);
  try {
    const snapshot = await collection.where('username', '==', username).get();
    return snapshot.empty;
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
    console.error(`Error checking username uniqueness for ${userType}:`, error);
    throw error;
  }
}

// Check if email is unique
async function isEmailUnique(email, userType) {
  const collection = getCollection(userType);
  try {
    const snapshot = await collection.where('email', '==', email).get();
    return snapshot.empty;
  } catch (error) {
    console.error(`Error checking email uniqueness for ${userType}:`, error);
    throw error;
  }
}

// Search data by email
async function searchDataByEmail(email, userType) {
  const collection = getCollection(userType);
  try {
    const snapshot = await collection.where('email', '==', email).get();
    if (snapshot.empty) {
      return "User not found";
    }
    let user;
    snapshot.forEach(doc => {
      user = doc.data();
    });
    return user;
  } catch (error) {
    console.error(`Error finding data by email for ${userType}:`, error);
    throw error;
  }
}

// Function to check if the file is a jpg or jpeg image
function isJpgOrJpeg(filePath) {
  const validExtensions = ['.jpg', '.jpeg'];
  const fileExtension = path.extname(filePath).toLowerCase();
  return validExtensions.includes(fileExtension);
}

// Function to upload a picture to Firebase Storage and store its URL in Firestore (for doctors)
async function uploadDoctorPicture(userId, filePath) {
  try {
    if (!isJpgOrJpeg(filePath)) {
      throw new Error('Invalid image format. Only .jpg and .jpeg are allowed.');
    }

    const fileName = `doctor-pictures/${uuidv4()}-${path.basename(filePath)}`;
    const file = bucket.file(fileName);

    await bucket.upload(filePath, {
      destination: file,
      metadata: {
        contentType: 'image/jpeg', // Adjust the content type based on your requirements
      },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Adjust expiration as needed
    });

    const collection = getCollection(2); // Collection for doctors
    await collection.doc(userId).set({ pictureUrl: url }, { merge: true });

    console.log('Picture uploaded and URL saved to Firestore');
    return url;
  } catch (error) {
    console.error('Error uploading picture:', error);
    throw error;
  }
}

// Function to check the picture's format (assuming the URL is stored in Firestore, for doctors)
async function checkDoctorPictureFormat(userId) {
  try {
    const collection = getCollection(2); // Collection for doctors
    const doc = await collection.doc(userId).get();

    if (!doc.exists) {
      console.log('No such document!');
      return null;
    }

    const data = doc.data();
    const url = data.pictureUrl;
    const isJpeg = url.endsWith('.jpg') || url.endsWith('.jpeg');

    return isJpeg ? 'JPEG' : 'Unknown format';
  } catch (error) {
    console.error('Error checking picture format:', error);
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
  const Collection = db.collection('forgot-Password');

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

// Function to get exports based on user type
function getExports(userType) {
  if (userType === 2) { // Doctor
    return {
      isUsernameUnique,
      isEmailUnique,
      searchDataByEmail,
      uploadDoctorPicture,
      checkDoctorPictureFormat,
    };
  } else if (userType === 3) { // Patient
    return {
      isUsernameUnique,
      isEmailUnique,
      searchDataByEmail,
    };
  } else {
    throw new Error('Invalid user type');
  }
module.exports = {
  isUsernameUnique,
  isEmailUnique,
  searchDataByEmail,
  getLatestUserDataByEmail,
  getLatestVerificationCodeByEmail,
}

module.exports = getExports;
