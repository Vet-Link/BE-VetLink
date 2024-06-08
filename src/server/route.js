const express = require('express');
const { userRegistration } = require('../user/pet owner/regisHandler');
const { userLogin } = require('../user/pet owner/loginHandler');
const emailLinkVerificator = require('../verification/verifiedFromEmailLink');
const { userResetPasswordReq, userResetPasswordVerification, userResetPasswordInput } = require('../password reset/resetPasswordHandler');
const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

//Registration route
router.post('/loginUser', userLogin)
router.post('/regisUser', userRegistration);
router.get('/:id/verify/:token', emailLinkVerificator);

//Forgot password Route
router.post('/forgotPassword', userResetPasswordReq);
router.post('/forgotPassword/verification', userResetPasswordVerification);
router.post('/forgotPassword/verification/input', userResetPasswordInput);

module.exports = router;
