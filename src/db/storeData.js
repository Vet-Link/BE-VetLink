//const { func } = require("joi");
const db = require("./initializeDB");

async function storeDataRegis(ID, userDataRegis) {
  const Collection = db.collection('login-info');
  await Collection.doc(ID).set(userDataRegis);
}

async function storeDataPet(ID, petData) { 
  const Collection = db.collection('pet-data');
  await Collection.doc(ID).set(petData);
}

async function storeDataDoctor(ID, doctorData) { 
  const Collection = db.collection('doctor-data');
  await Collection.doc(ID).set(doctorData);
}

async function storeVerificationTokens(ID, data){
  const Collection = db.collection('verificationTokens');
  await Collection.doc(ID).set(data);

}

// async function main(){
//   const ID = "Test";
//   const A = "terse";
//   const B = "rah";
//   await storeDataDoctor(ID,{A,B});
//   await storeVerificationTokens(ID, {A,B});
// }

// main();




module.exports = {
    storeDataRegis,
    storeDataPet,
    storeDataDoctor,
    storeVerificationTokens
}