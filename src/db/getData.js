const { Firestore } = require('@google-cloud/firestore');

async function isUsernameUnique(username) {
  const db = new Firestore({
      databaseId: 'patient-db'
  });

  const loginInfoCollection = db.collection('login-info');

  try {
    // Query for documents with the given username
    const snapshot = await loginInfoCollection.where('username', '==', username).get();

    // Check if any documents were found
    if (snapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking username uniqueness:', error);
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
}