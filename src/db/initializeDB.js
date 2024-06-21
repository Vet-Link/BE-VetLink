const { Firestore } = require('@google-cloud/firestore');
const keyFile = require('./service-key-firestore.json')

const db = new Firestore({
  projectId: 'vetlink-425416',
  credentials: keyFile,
  databaseId: 'patient-db'
});

module.exports =  db ;