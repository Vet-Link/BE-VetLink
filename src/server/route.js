const express = require('express');
const Multer = require("multer");
const router = express.Router();

const { userRegistration } = require('../user/pet owner/regisHandler');
const { userLogin } = require('../user/pet owner/loginHandler');
const { docRegistration } = require('../user/doctor/docRegistHandler');
const { docLogin } = require('../user/doctor/docLoginHandler');
const emailLinkVerificator = require('../verification/verifiedFromEmailLink');
const { userResetPasswordReq, userResetPasswordVerification, userResetPasswordInput } = require('../password reset/resetPasswordHandler');
const { userUpdateProfile, userLoadBiodata } = require('../user/pet owner/userBiodata');
const { userAddPetData, loadPetProfile } = require('../user/pet owner/pet/petData');
const { getRecomendedDoctorData, getAllDocRecomendation } = require('../user/doctor/getAllDoctorData');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 3 * 1024 * 1024,
    },
  });

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

// User registration and login routes
router.post('/loginUser', userLogin);
router.post('/regisUser', userRegistration);
router.get('/verify/:userType/:id/:token', emailLinkVerificator);

// Doctor registration and login routes
router.post('/docRegisUser', multer.single('imgfile'), docRegistration);
router.post('/docLoginUser', docLogin);

// Forgot password routes
router.post('/forgotPassword', userResetPasswordReq);
router.post('/forgotPassword/verification', userResetPasswordVerification);
router.put('/forgotPassword/verification/input', userResetPasswordInput);

// User profile
router.post('/userProfile', userLoadBiodata);
router.put('/userProfile', multer.single('imgfile'), userUpdateProfile);

// Pet route
router.post('/addPet', userAddPetData);
router.get('/showPet', loadPetProfile);

// Doc route
router.get('/docSorted', getAllDocRecomendation);
router.get('/recomendedDoctor', getRecomendedDoctorData);

module.exports = router;
