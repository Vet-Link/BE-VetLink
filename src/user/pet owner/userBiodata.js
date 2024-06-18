const { getLatestUserDataByEmail } = require("../../db/getData");
const uploadToBucket = require("../../service/uploadToBucket");

async function userLoadBiodata(req, res) {
   const { email } = req.body;
   try {
       const userData = await getLatestUserDataByEmail(email);
       const username = userData.username;
       const profileUrl = userData.profileURL;
       const userEmail = userData.email;

       const userProfile = {
        username,
        userEmail,
        profileUrl
       }

       res.status(200).json({
        status: 'success',
        message: 'Profile succesfully showed',
        data: userProfile
       })
   } catch  (error) {
       console.error(error.message)
       res.status(500).json({ status: 'fail', message: 'Failed to load user profile' });
   }
}

async function userUpdateProfile(req, res) {
    const { email, newUsername } = req.body;
    //const { email } = req.body;

    try {
        // Retrieve current user data
        const userData = await getLatestUserDataByEmail(email);

        if(newUsername) {
            //check if the username is too short
            if(isUsernameTooShort(newUsername)) {return res.status(400).json({status: 'fail',message: 'Username is too short',});}

            //check if the username is too long
            if(isUsernameTooLong(newUsername)) {return res.status(400).json({status: 'fail',message: 'Username is too long',});}

            //check if the username has symbol
            if(isUsernameHasSymbol(newUsername)) {return res.status(400).json({status: 'fail',message: 'Username must not contain symbols',});}

            // Check if there is any change in the username
            if(userData.username === newUsername) {return res.status(400).json({status: 'fail',message: 'Username not changed',});}
            
            // Update username
            userData.username = newUsername;
        }

        // Handle photo profile upload
        if (req.file) {
            const fileName = `userProfile/${userData.ID}.jpg`;
            const usecase = 'profile';
            const userType = 'user';
            const Data = userData;

            try {
                const uploadStatus = await uploadToBucket(req.file, fileName, usecase, userType, Data);
                return res.status(uploadStatus.statusCode).json(uploadStatus.response);
            } catch (uploadError) {
                console.error(uploadError);
                return res.status(uploadError.statusCode || 500).json(uploadError.response || { status: 'fail', message: 'Error uploading file.' });
            }
        }

        res.status(200).json({ status: 'success', message: 'Username successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
}


module.exports = {
    userLoadBiodata,
    userUpdateProfile, 
}