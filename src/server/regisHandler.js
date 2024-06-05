const { storeDataRegis } = require("../db/storeData");
const crypto = require('crypto');
const getGMT7Date = require("../service/getGMT7Date");
const { isUsernameUnique, isEmailUnique } = require("../db/getData");
const { isUsernameTooShort, isUsernameTooLong, isUsernameHasSymbol, isPasswordValid } = require("../service/characterChecker");

async function patientRegistration(req, res) {
    try {
        const { username, email, password } = req.body;
        const time = getGMT7Date();
        const ID = crypto.randomUUID();
        const isUsernameUniqueCheck = await isUsernameUnique(username);
        const isEmailUniqueCheck = await isEmailUnique(email);

        if(isUsernameTooShort(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username is too short',
            });
        }

        if(isUsernameTooLong(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username is too long',
            });
        }

        if(isUsernameHasSymbol(username)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Usernames must not contain symbols',
            });
        }

        if(isPasswordValid(password)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password is too short',
            });
        }

        if(!isUsernameUniqueCheck) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username already exists',
            });
        }

        if(!isEmailUniqueCheck) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already exists',
            });
        }


        const userData = {
            username, email, password, time,
        }
        await storeDataRegis(ID, userData);

        return res.status(200).json({
            status: 'success',
            message: 'statusMSG',
        })
        
        //Kirim status handler ke database
        //const statusMSG = `User ID ${ID} is created`;
        //const statusId = crypto.randomUUID();
        //const gsmStatus = {
        //    statusMSG, time,
        //}
        //await storeDataStatus(statusId, gsmStatus);
    } catch (error) {
        //Kirim status handler ke database
        //handleFailure("Failed to receive data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to receive data from the frontend',
            error: error.message,
        });
    }
};

module.exports = {
    patientRegistration,
}