const { CollectionGroup } = require("@google-cloud/firestore");
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

async function saveVerificationCode(email, data) {
  const Collection = db.collection('forgot-password');
  await Collection.doc(email).set(data);
}

async function storeDataDoctor(ID, doctorData) { 
  const Collection = db.collection('doctor-data');
  await Collection.doc(ID).set(doctorData);
  await makeSpecialtyDirectory(ID, doctorData.speciality)
}

async function makeSpecialtyDirectory(ID, specialty) {
  specialty.forEach(doc => {
    const collectionPAth = `doctor-data/${ID}/doc_recom`;
    Collection = db.collection(collectionPAth);
    Collection.doc(doc).set({});
  });
}

async function storeVerificationTokens(ID, data){
  const Collection = db.collection('verificationTokens');
  await Collection.doc(ID).set(data);
}

module.exports = {
    storeDataRegis,
    storeDataPet,
    storeDataDoctor,
    storeVerificationTokens,
    saveMessageToDatabase,
    saveVerificationCode,
}