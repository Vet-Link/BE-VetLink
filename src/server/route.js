const express = require('express');
const { patientRegistration } = require('./regisHandler');
const router = express.Router();

// Define the routes
router.get('/', (req, res) => {
    console.log("Backend service running normally");
    res.send("Backend service running normally");
});

router.post('/regisUser', patientRegistration);

module.exports = router;
