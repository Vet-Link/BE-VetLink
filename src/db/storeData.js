const db = require("./initializeDB");

async function storeDataRegis(ID, userDataRegis) {
  const Collection = db.collection('login-info');
  await Collection.doc(ID).set(userDataRegis);
}

async function storeDataPet(ID, petData) { 
  const collectionPath = `login-info/${ID}/pet-data`;
  const petCollection = db.collection(collectionPath);
  await petCollection.doc(petData.petId).set(petData);
}

async function saveMessageToDatabase(conversationID, messageId, data) {
  const collectionPath = `messages/${conversationID}/message-data`;
  const petCollection = db.collection(collectionPath);
  await petCollection.doc(messageId).set(data);
}

module.exports = {
    storeDataRegis,
    storeDataPet,
    saveMessageToDatabase,
}