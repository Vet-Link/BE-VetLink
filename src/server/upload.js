// src/service/upload.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'vetlink-425416', // replace with your project ID
  keyFilename: path.join(__dirname, '../../keyfile.json') // replace with your key file path
});
const bucket = storage.bucket('vetlink'); // replace with your bucket name

async function uploadFileToGCS(file, newFilename) {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
}

module.exports = {
  uploadFileToGCS,
};
