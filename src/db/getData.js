const { db } = require('./initializeDB');


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



//hapus
module.exports = {
  isUsernameUnique,
  isEmailUnique,
  searchDataByEmail,
}
