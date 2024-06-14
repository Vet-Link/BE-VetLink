const { db } = require('./initializeDB');


// Function to determine the collection based on user type
// function getCollection(userType) {
//   if (userType === 2) {
//     return db.collection('doctor-data');
//   } else if (userType === 3) {
//     return db.collection('login-info');
//   } else {
//     throw new Error('Invalid user type');
//   }
// }

// Check if username is unique
// async function isUsernameUnique(username) {
//   const Collection = db.collection('login-info');
//   try {
//     const snapshot = await Collection.where('username', '==', username).get();
//     return snapshot.empty;
//   } catch (error) {
//     console.error(`Error checking username uniqueness for ${'login-info'}:`, error);
//     throw error;
//   }
// }

// Check if email is unique
async function isEmailUnique(email) {
  const Collection = db.collection('login-info');
  try {
    const snapshot = await Collection.where('email', '==', email).get();
    return snapshot.empty;
  } catch (error) {
    console.error(`Error checking email uniqueness for ${'login-info'}:`, error);
    throw error;
  }
}

// Search data by email
async function searchDataByEmail(email) {
  const Collection = db.collection('login-info');
  try {
    const snapshot = await Collection.where('email', '==', email).get();
    if (snapshot.empty) {
      return "User not found";
    }
    let user;
    snapshot.forEach(doc => {
      user = doc.data();
    });
    return user;
  } catch (error) {
    console.error(`Error finding data by email for ${'login-info'}:`, error);
    throw error;
  }
}



module.exports = {
  //isUsernameUnique,
  isEmailUnique,
  searchDataByEmail,
}
