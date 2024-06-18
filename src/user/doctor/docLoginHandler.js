const { isDocEmailUnique, searchDocDataByEmail } = require("../../db/getDataDoc");
const bcrypt = require("bcrypt");
const validator = require('validator');
const jwt = require("jsonwebtoken");

async function docLogin(req, res) {
    const { email, password } = req.body;
    const isEmailRegistered = await isDocEmailUnique(email);
    const userData = await searchDocDataByEmail(email);

    try {
        //check if email is in valid format
        if (!validator.isEmail(email)) {
            return res.status(400).send({
                status: 'error',
                message: 'Email is not valid. Please try again!',
            });
        }

        //check if there 
        if (isEmailRegistered) {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid Email or Password. Please try again!',
            });
        }

        //check password
        const validPassword = await bcrypt.compare(password, userData.hashedPassword);
        if (!validPassword) {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid Email or Password. Please try again!',
            });
        }

        //check if user is verified
        if(!userData.verified) {
            return res.status(403).send({
                status: 'error',
                message: 'Please verify your account',
            });
        }

        // Generate JWT token
        const token = jwt.sign({ email: userData.email, _id: userData.ID }, process.env.SECRETKEY, { expiresIn: "30h" });
        return res.status(200).send({ 
            data: token, 
            message: "Doctor was successfully logged in" 
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error' + error.message,
        })
    }
}

module.exports = { 
    docLogin, 
};