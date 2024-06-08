const db = require("./initializeDB");

async function storeDataRegis(ID, userDataRegis) {
  const Collection = db.collection('login-info');
  await Collection.doc(ID).set(userDataRegis);
}

async function storeDataPet(ID, petData) { 
  const collectionPath = `login-info/${ID}/pet-data`;
  const petCollection = db.collection(collectionPath);
  //const userCollection = db.collection('login-info').doc(ID);
  //const petCollection = userCollection.collection('pet-data');
  await petCollection.doc(petData.petId).set(petData);
}

module.exports = {
    storeDataRegis,
    storeDataPet,
}