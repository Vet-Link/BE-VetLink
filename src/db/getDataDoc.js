const db = require('./initializeDB');

// Check if username is unique
// async function isUsernameUnique(username) {
//   if (!username) {
//     throw new Error("Username is undefined or null");
//   }
//   const Collection = db.collection('doctor-data');
//   try {
//     const snapshot = await Collection.where('username', '==', username).get();
//     return snapshot.empty;
//   } catch (error) {
//     console.error(`Error checking username uniqueness for 'doctor-data':`, error);
//     throw error;
//   }
// }

// Check if email is unique
async function isEmailUnique(email) {
  if (!email) {
    throw new Error("Email is undefined or null");
  }
  const Collection = db.collection('doctor-data');
  try {
    const snapshot = await Collection.where('email', '==', email).get();
    if (snapshot.empty)
      {
        return true;
      }
    return false;
    
  } catch (error) {
    console.error(`Error checking email uniqueness for 'doctor-data':`, error);
    throw error;
  }
}

// Search data by email
async function searchDataByEmail(email) {
  if (!email) {
    throw new Error("Email is undefined or null");
  }
  const Collection = db.collection('doctor-data');
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
    console.error(`Error finding data by email for 'doctor-data':`, error);
    throw error;
  }
}

module.exports = {
  //isUsernameUnique,
  isEmailUnique,
  searchDataByEmail,
}
