const { getAllDocDataForTraining } = require("../db/getDataDoc");
const bucket = require("../db/initializeStorage");
const crypto = require('crypto');

const jsonToCsv = (jsonArray) => {
    if (!jsonArray || !jsonArray.length) {
        return null;
    }

    const headers = Object.keys(jsonArray[0]);
    const csvRows = [];

    // Build header row
    csvRows.push(headers.join(','));

    // Build data rows
    jsonArray.forEach((jsonObj) => {
        const values = headers.map((header) => {
            let value = jsonObj[header];
            // Ensure values are properly escaped if necessary
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
};


async function uploadToBucket() {
    const Data = await getAllDocDataForTraining();
    const ID = crypto.randomUUID();
    const fileName = `trainingData/${ID}.csv`

    // Convert JSON to CSV
    const csvContent = jsonToCsv(Data);
    //console.log(csvContent);

    // Upload CSV file to Google Cloud Storage
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
        resumable: false, // Ensure the stream is not resumable to simplify handling
        contentType: 'text/csv' // Set the content type explicitly for CSV files
    });

    return new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
            try {
                await blob.makePublic();
                //const timestamp = new Date().getTime();
                //const publicUrl = `https://storage.googleapis.com/vetlink/${fileName}?t=${timestamp}`;
            } catch (err) {
                console.error('Error making file public:', err);
            }
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading file:', err);
            reject({
                statusCode: 500,
                response: { status: 'fail', message: 'Error uploading file.' }
            });
        });

        // Write CSV content to the stream
        blobStream.end(csvContent);
    });
}

uploadToBucket();