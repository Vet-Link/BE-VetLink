const { Storage } = require("@google-cloud/storage");
const keyFilename = require("../../service-key-bucket.json")

const storage = new Storage({
    projectId: 'vetlink-425416',
    credentials: keyFilename
});

const bucket = storage.bucket("vetlink");

module.exports = bucket;