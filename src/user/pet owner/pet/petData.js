const crypto = require('crypto');
const { storeDataPet } = require("../../../db/storeData");
const { getAllPetById, isPetNameUnique } = require('../../../db/getData');
const { isUsernameTooShort, isUsernameHasSymbol, isUsernameTooLong } = require('../../../service/characterChecker');

async function userAddPetData (req, res) {
    const { ID, pet_name, pet_gender, pet_age, pet_species, pet_weight } = req.body;
    const cryptoID = crypto.randomUUID().replace(/-/g, '');
    const petId = `pet_${cryptoID}`;
    const isPet_nameUnique = await isPetNameUnique(ID, pet_name);

    const petData = {
        petId,
        pet_name,
        pet_gender,
        pet_age,
        pet_species,
        pet_weight,
    };

    try {
        //check if the username is too short
        if(isUsernameTooShort(pet_name)) {return res.status(400).json({status: 'fail',message: 'Username is too short',});}

        //check if the username is too long
        if(isUsernameTooLong(pet_name)) {return res.status(400).json({status: 'fail',message: 'Username is too long',});}

        //check if the username has symbol
        if(isUsernameHasSymbol(pet_name)) {return res.status(400).json({status: 'fail',message: 'Usernames must not contain symbols',});}
        
        // check if the pet name is not duplicated
        if(!isPet_nameUnique) {return res.status(409).json({status: 'fail',message: 'You have already add this pet',});}

        //store pet data
        await storeDataPet(ID, petData);

        return res.status(200).json({status: 'success',message: 'Pet Data sucessfully registered.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'fail',message: 'Failed to save pet data'});
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

