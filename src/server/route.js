const express = require('express');
const { userRegistration } = require('../user/pet owner/regisHandler');
const { userLogin } = require('../user/pet owner/loginHandler');
const { docRegistration, photo } = require('../user/doctor/docRegistHandler');
const { docLogin } = require('../user/doctor/docLoginHandler');
const emailLinkVerificator = require('../verification/verifiedFromEmailLink');
const { userResetPasswordReq, userResetPasswordVerification, userResetPasswordInput } = require('../password reset/resetPasswordHandler');
const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

// Registration and login routes
router.post('/loginUser', userLogin);
router.post('/regisUser', userRegistration);
router.post('/docLoginUser', docLogin);
router.post('/docRegisUser', docRegistration);
router.get('/:id/verify/:token', emailLinkVerificator);

// Forgot password routes
router.post('/forgotPassword', userResetPasswordReq);
router.post('/forgotPassword/verification', userResetPasswordVerification);
router.post('/forgotPassword/verification/input', userResetPasswordInput);

module.exports = router;
