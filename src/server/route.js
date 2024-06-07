const express = require('express');
const { userRegistration } = require('./regisHandler');
const emailLinkVerificator = require('../verification/verifiedFromEmailLink');
const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

//Registration route
router.post('/regisUser', userRegistration);
router.get('/:id/verify/:token', emailLinkVerificator);

module.exports = router;
