const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'vetlink-425416',
  keyFilename: './service-key-firestore.json',
  databaseId: 'patient-db',
});

module.exports = db;