const { getLatestUserDataByEmail } = require("../../db/getData");
const bucket = require("../../db/initializeStorage");
const { storeDataRegis } = require("../../db/storeData");

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
    //const { username, email, password, passwordVerify } = req.body;

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
            console.log("File found, trying to upload...");
            const fileName = `${userData.ID}.jpg`;
            const blob = bucket.file(`User profile/${fileName}`);
            const blobStream = blob.createWriteStream();

            // Handle successful upload
            blobStream.on("finish", async () => {
                try {
                    // Make the file publicly accessible
                    await blob.makePublic();

                    // Add a cache-busting parameter to the URL
                    const timestamp = new Date().getTime();
                    const publicUrl = `https://storage.googleapis.com/vetlink/User%20profile/${fileName}?t=${timestamp}`;
                    console.log(`File uploaded and publicly accessible at: ${publicUrl}`);

                    // Add profile URL to userData
                    userData.profileURL = publicUrl;
                    
                    // Save updated user data back to the database
                    await storeDataRegis(userData.ID, userData);

                    // Return response with updated or new username and photo URL
                    const response = {
                        status: 'success',
                        message: 'Profile updated successfully',
                        photoUrl: publicUrl,
                    };

                    res.status(200).json(response);
                } catch (err) {
                    console.error('Error making file public:', err);
                    res.status(500).json({ status: 'fail', message: 'Error making file public.' });
                } 
            });

            // Handle errors during the upload
            blobStream.on('error', (err) => {
                console.error('Error uploading file:', err);
                res.status(500).json({ status: 'fail', message: 'Error uploading file.' });
            });

            // Pipe the file buffer to the writable stream
            blobStream.end(req.file.buffer);
        }
        res.status(200).json({status: 'success', message: 'Username successfully updated'});
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
}

module.exports = {
    userLoadBiodata,
    userUpdateProfile, 
}