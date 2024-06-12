const crypto = require('crypto');
const { storeDataPet } = require("../../../db/storeData");

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

module.exports = userAddPetData;

