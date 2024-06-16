const express = require("express");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const validator = require('validator');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const { storeDataDoctor } = require("../../db/storeData");
const getGMT7Date = require("../../service/getGMT7Date");
const { isEmailUnique } = require("../../db/getDataDoc");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, validatePassword } = require("../../service/characterChecker");
const sendVerificationEmail = require('../../verification/sendVerification');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'vetlink-425416', // replace with your project ID
  keyFilename: path.join(__dirname, '../../../keyfile.json') // replace with your key file path
});
const bucket = storage.bucket('vetlink'); // replace with your bucket name

const time = getGMT7Date();
const ID = crypto.randomUUID();
// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

async function uploadFileToGCS(file) {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`vet certificate/${ID}`);
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

async function docRegistration(req, res) {
  const { username, email, password, passwordVerify, speciality } = req.body;
  console.log(username, email, password, passwordVerify);

  if (!username || !email || !password || !passwordVerify) {
    return res.status(400).json({ status: 'fail', message: 'All fields are required' });
  }


  console.log("Hello disini 1");

  try {
    const isEmailUniqueCheck = await isEmailUnique(email);

    if (isUsernameTooShort(username)) {
      return res.status(400).json({ status: 'fail', message: 'Username is too short' });
    }
    if (isUsernameTooLong(username)) {
      return res.status(400).json({ status: 'fail', message: 'Username is too long' });
    }
    if (isUsernameHasSymbol(username)) {
      return res.status(400).json({ status: 'fail', message: 'Usernames must not contain symbols' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({ status: 'error', message: 'Email is not valid. Please try again!' });
    }
    if (!isEmailUniqueCheck) {
      return res.status(409).json({ status: 'fail', message: 'Email is already in use! try logging in' });
    }
    try {
      validatePassword(password);
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({ status: 'fail', message: 'Password do not match' });
    }

    console.log("Hello disini 1.5");
    const emailResult = await sendVerificationEmail(email, username, ID);
    console.log("Hello disini 2");
    if (!emailResult.success) {
      return res.status(500).json({ status: 'fail', message: 'Data failed to be registered. ' + emailResult.message });
    }
    console.log("Hello disini 3");

    const saltRounds = parseInt(process.env.SALT, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const docData = { ID, username, email, speciality, hashedPassword, time };
    await storeDataDoctor(ID, docData);
    console.log("Hello disini 4");

    if (req.file) {
      const newFilename = `${ID}_profile_${Date.now()}_${blob.name}`;
      const fileUrl = await uploadFileToGCS(req.file, newFilename);
      return res.status(200).json({ status: 'success', message: 'Data successfully registered.', fileUrl });
    } else {
      return res.status(200).json({ status: 'success', message: 'Data successfully registered.' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: 'fail', message: 'Failed to receive data from the frontend', error: error.message });
  }
};

module.exports = {
  docRegistration,
};
