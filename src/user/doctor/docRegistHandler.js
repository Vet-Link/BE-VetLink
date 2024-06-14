const express = require("express");

const crypto = require('crypto');
const bcrypt = require("bcrypt");
const validator = require('validator');


const { storeDataDoctor } = require("../../db/storeData");
const getGMT7Date = require("../../service/getGMT7Date");
const { isEmailUnique } = require("../../db/getDataDoc");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, validatePassword } = require("../../service/characterChecker");
const sendVerificationEmail = require('../../verification/sendVerification');




async function docRegistration(req, res) {

  const { username, email, password, passwordVerify } = req.body;
  console.log(username, email, password, passwordVerify);
  
  if(!username || !email || !password || !passwordVerify)
    {
      const { username, email, password, passwordVerify } = require("../../../photo/serverKiel")
    }
  
  if (!username || !email || !password || !passwordVerify) {
    return res.status(400).json({ status: 'fail', message: 'All fields are required'});
  }
  


  const time = getGMT7Date();
  const ID = crypto.randomUUID();
  console.log("Hello disini 1");

  
  try {
    //const isUsernameUniqueCheck = await isUsernameUnique(username);
    const isEmailUniqueCheck = await isEmailUnique(email);

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
    // if (!isUsernameUniqueCheck) {
    //   return res.status(400).json({ status: 'fail', message: 'Username already exists' });
    // }
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
    const docData = { ID, username, email, hashedPassword, time };
    await storeDataDoctor(ID, docData);
    console.log("Hello disini 4");
    //return res.status(200).json({ status: 'success', message: 'Data successfully registered. ' + emailResult.message });

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: 'fail', message: 'Failed to receive data from the frontend', error: error.message });
  }
};


module.exports = {
  docRegistration,
  
}
