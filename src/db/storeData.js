const { Firestore } = require('@google-cloud/firestore');
 
async function storeDataRegis(ID, userDataRegis) {
  const db = new Firestore({
    databaseId: 'patient-db'
  });
 
  const predictCollection = db.collection('login-info');
  return predictCollection.doc(ID).set(userDataRegis);
}

async function storeDataPet(ID, petData) {
    const db = new Firestore({
      databaseId: 'patient-db'
    });
    
    const predictCollection = db.collection('pet-data');
    return predictCollection.doc(ID).set(petData);
}

module.exports = {
    storeDataRegis,
    storeDataPet,
}