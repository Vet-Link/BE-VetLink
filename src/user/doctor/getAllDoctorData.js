const { sortDoctorByScore, getRecomendedDoctor } = require("../../db/getDataDoc");

async function getAllDocRecomendation (req, res) {
    try {
        const docData = await sortDoctorByScore();
        
        return res.status(200).send({ 
            status: 'success',
            message: "Doctor succesfully sorted",
            docData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: 'Server error', error: error.message });
    }
}

async function getRecomendedDoctorData (req, res) {
    try {
        const docData = await getRecomendedDoctor();

        return res.status(200).send({ 
            status: 'success',
            message: 'Doctor succesfully sorted',
            docData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: 'Server error', error: error.message });
    }
}

module.exports = { getAllDocRecomendation, getRecomendedDoctorData };