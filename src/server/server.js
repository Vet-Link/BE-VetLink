const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const router = require('./route');
const app = express();
const fileUpload = require('express-fileupload');
require('dotenv').config();


app.use(bodyParser.json());
app.use(express.urlencoded ({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//const registrationRoute = require('../user/doctor/docRegistHandler');
//const uploadRoute = require('./upload');

app.use(router);
app.use(fileUpload());

const PORT = process.env.PORT || 9000; // Change port to 9000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});
