const bucket = require("../db/initializeStorage");
const { storeDataDoctor, storeDataRegis } = require("../db/storeData");

async function uploadToBucket(file, fileName, usecase, userType, Data) {
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
            try {
                await blob.makePublic();
                const timestamp = new Date().getTime();
                const publicUrl = `https://storage.googleapis.com/vetlink/${fileName}?t=${timestamp}`;
                console.log(`File uploaded and publicly accessible at: ${publicUrl}`);

                // Function usage
                if (usecase === 'profile') {
                    Data.profileURL = publicUrl;
                } else if (usecase === 'docRegis') {
                    Data.certificateURL = publicUrl;
                }

                // Check for user type
                if (userType === 'user') {
                    await storeDataRegis(Data.ID, Data);
                } else if (userType === 'doctor') {
                    await storeDataDoctor(Data.ID, Data);
                }

                resolve({
                    statusCode: 200,
                    response: {
                        status: 'success',
                        message: 'File uploaded successfully',
                        photoUrl: publicUrl,
                    }
                });
            } catch (err) {
                console.error('Error making file public:', err);
                reject({
                    statusCode: 500,
                    response: {
                        status: 'fail',
                        message: 'Error making file public.'
                    }
                });
            }
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            reject({
                statusCode: 500,
                response: { status: 'fail', message: 'Error uploading file.' }
            });
        });

        blobStream.end(file.buffer);
    });
}

module.exports = uploadToBucket;
