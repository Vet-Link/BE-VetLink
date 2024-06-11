const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const validator = require('validator');
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const { storeDataRegis } = require("../../db/storeData");
const getGMT7Date = require("../../service/getGMT7Date");
const { isUsernameUnique, isEmailUnique } = require("../../db/getData");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, validatePassword } = require("../../service/characterChecker");
const sendVerificationEmail = require('../../verification/sendVerification');

// Google Cloud Storage setup
let projectId = "vetlink-425416";
let keyFilename = "keyfile.json";
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("vetlink");

// Multer setup
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

async function docRegistration(req, res) {
  const { username, email, password, passwordVerify } = req.body;
  const time = getGMT7Date();
  const ID = crypto.randomUUID();
  const isUsernameUniqueCheck = await isUsernameUnique(username);
  const isEmailUniqueCheck = await isEmailUnique(email);

  try {
    // Check username and email validity
    if (isUsernameTooShort(username)) {
      return res.status(400).json({ status: 'fail', message: 'Username is too short' });
    }
    if (isUsernameTooLong(username)) {
      return res.status(400).json({ status: 'fail', message: 'Username is too long' });
    }
    if (isUsernameHasSymbol(username)) {
      return res.status(400).json({ status: 'fail', message: 'Usernames must not contain symbols' });
    }
    if (!isUsernameUniqueCheck) {
      return res.status(400).json({ status: 'fail', message: 'Username already exists' });
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


    if (req.file) {
      const blob = bucket.file(`vet certificate/${req.file.originalname}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", async () => {
        const saltRounds = parseInt(process.env.SALT, 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userData = { ID, username, email, hashedPassword, time };

        const emailResult = await sendVerificationEmail(email, username, ID);
        if (!emailResult.success) {
          return res.status(500).json({ status: 'fail', message: 'Data failed to be registered. ' + emailResult.message });
        }

        await storeDataRegis(ID, userData);
        return res.status(200).json({ status: 'success', message: 'Data successfully registered. ' + emailResult.message });
      });

      blobStream.end(req.file.buffer);
    } else {
      throw new Error("File not found");
    }
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Failed to receive data from the frontend', error: error.message });
  }
};

router.post("/", multer.single("imgfile"), docRegistration);

module.exports = router;
