const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require("bcrypt");

const getGMT7Date = require("../../service/getGMT7Date");
const { isDocEmailUnique } = require("../../db/getDataDoc");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, validatePassword } = require("../../service/characterChecker");
const sendVerificationEmail = require('../../verification/sendVerification');
const uploadToBucket = require('../../service/uploadToBucket');

async function docRegistration(req, res) {
  const { username, email, password, passwordVerify, speciality } = req.body;
  console.log(username, email, password, passwordVerify);
  const time = getGMT7Date();
  const cryptoID = crypto.randomUUID().replace(/-/g, '');
  const ID = `vet_${cryptoID}`

  if (!username || !email || !password || !passwordVerify) {
    return res.status(400).json({ status: 'fail', message: 'All fields are required' });
  }

  try {
    const isEmailUniqueCheck = await isDocEmailUnique(email);

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

    const emailResult = await sendVerificationEmail('doctor', email, username, ID);
    if (!emailResult.success) {
      return res.status(500).json({ status: 'fail', message: 'Data failed to be registered. ' + emailResult.message });
    }

    const saltRounds = parseInt(process.env.SALT, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const docData = { ID, username, email, speciality, hashedPassword, time };

    if (req.file) {
      const newFilename = `vetCertificate/${ID}_profile.jpg`;
      const usecase = 'docRegis';
      const userType = 'doctor';
      const Data = docData;

      try {
        const uploadStatus = await uploadToBucket(req.file, newFilename, usecase, userType, Data);
        await sendVerificationEmail('doctor', email, username, ID);
        return res.status(uploadStatus.statusCode).json(uploadStatus.response);
      } catch (uploadError) {
        console.error(uploadError);
        return res.status(uploadError.statusCode || 500).json(uploadError.response || { status: 'fail', message: 'Error uploading file.' });
      }
    } else {
      res.status(400).json({ status: 'fail', message: 'Certificate needed to be filled' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: 'fail', message: 'Failed to receive data from the frontend', error: error.message });
  }
};

module.exports = {
  docRegistration,
};
