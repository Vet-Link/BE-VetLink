const express = require('express');
const { userRegistration } = require('../user/pet owner/regisHandler');
const { userLogin } = require('../user/pet owner/loginHandler');
const emailLinkVerificator = require('../verification/verifiedFromEmailLink');
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

module.exports = router;
