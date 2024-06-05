const { storeDataRegis } = require("../db/storeData");
const crypto = require('crypto');

async function patientRegistration(req, res) {
    try {
        const { username, email, password } = req.body;
        const time = getGMT7Date();
        const ID = crypto.randomUUID();

        const gsmData = {
            username, email, password, time,
        }
        await storeDataSensor(ID, gsmData);

        //Kirim status handler ke database
        //const statusMSG = `User ID ${ID} is created`;
        //const statusId = crypto.randomUUID();
        //const gsmStatus = {
        //    statusMSG, time,
        //}
        //await storeDataStatus(statusId, gsmStatus);

        //Response
        res.status(200).json({
            status: 'success',
            message: 'statusMSG',
        });
    } catch (error) {
        //Kirim status handler ke database
        handleFailure("Failed to receive data from GSM module", error);
        res.status(500).json({
            status: 'fail',
            message: 'Failed to receive data from GSM module',
            error: error.message,
        });
    }
};