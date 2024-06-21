const db = require('./initializeDB');

// Check if email is unique
async function isDocEmailUnique(email) {
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
async function searchDocDataByEmail(email) {
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

// Get all doctor data
async function getAllDocDataForTraining() {
  const docCollection = db.collection('doctor-data');
  try {
    const snapshot = await docCollection
      .get();

    if (snapshot.empty) {
      return "No doctor data found";
    }

    const doctorData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      doctorData.push({
        vet_name: doc.id,
        specialty: data.speciality,
        rating: data.rating,
        num_rating: data.num_rating,
        sign_in_time: data.time
      });
    });

    return doctorData;
  } catch (error) {
    console.error("Cannot get all doctor data for training : " + error);
    throw error;
  }
}

// Get doctor data sorted by its score
async function sortDoctorByScore() {
  const docCollection = db.collection('doctor-data');
  try {
    const snapshot = await docCollection
    .orderBy("score", "desc")
    .get();

  if (snapshot.empty) {
    return "No doctor data found";
  }

  const doctorData = [];
    snapshot.forEach(doc => {
      doctorData.push({
        ...doc.data()
      });
    });

    return doctorData;
  } catch (error) {
    console.error("Cannot get all doctor data : " + error);
    throw error;
  }
}

// Get recomended doctor
async function getRecomendedDoctor() {
  const docCollection = db.collection('doctor-data');
  try {
    const snapshot = await docCollection
    .where("newcomer_status", "==", true)
    .orderBy("score", "desc")
    .limit(10)
    .get();

    if (snapshot.empty) {
      return "No doctor data found";
    }
  
    const doctorData = [];
      snapshot.forEach(doc => {
        doctorData.push({
          ...doc.data()
        });
      });
  
    return doctorData;
  } catch (error) {
    console.error("Cannot get all doctor data : " + error);
    throw error;
  }
}

module.exports = {
  isDocEmailUnique,
  searchDocDataByEmail,
  getAllDocDataForTraining,
  sortDoctorByScore,
  getRecomendedDoctor,
}
