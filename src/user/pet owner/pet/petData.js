const crypto = require('crypto');
const { storeDataPet } = require("../../../db/storeData");
const { getAllPetById } = require('../../../db/getData');

async function userAddPetData (req, res) {
    const {
        ID,
        pet_name,
        pet_gender,
        pet_age,
        pet_species,
        pet_weight } = req.body;
    const petId = crypto.randomUUID();

    const petData = {
        petId,
        pet_name,
        pet_gender,
        pet_age,
        pet_species,
        pet_weight,
    };

    try {
        //store pet data
        await storeDataPet(ID, petData);

        return res.status(200).json({status: 'success',message: 'Pet Data sucessfully registered.'});
    } catch (error) {
        res.status(400).json({status: 'fail',message: 'Failed to receive data from the frontend', error: error.message});
    }
}

async function loadPetProfile(req, res) {
    const { ID } = req.body;

    try {
        const petData = await getAllPetById(ID);
        
        res.status(200).json({
            status: 'success',
            message: 'Profile succesfully showed',
            data: petData
           })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ status: 'fail', message: 'Failed to load pet data' });
    }
}

module.exports = {
    userAddPetData,
    loadPetProfile
};

