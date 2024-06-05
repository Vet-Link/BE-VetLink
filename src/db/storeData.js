const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({
  projectId: 'vetlink-425416',
  keyFilename: './service-key-firestore.json',
  databaseId: 'patient-db',
});

async function storeDataRegis(ID, userDataRegis) {
  const predictCollection = db.collection('login-info');
  return predictCollection.doc(ID).set(userDataRegis);
}

async function storeDataPet(ID, petData) { 
  const predictCollection = db.collection('pet-data');
  return predictCollection.doc(ID).set(petData);
}

module.exports = {
    storeDataRegis,
    storeDataPet,
}