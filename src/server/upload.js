const express = require('express');
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const router = express.Router();

// Google Cloud Storage setup
let projectId = "vetlink-425416";
let keyFilename = "keyfile.json";
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("vetlink");

// Multer setup
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

// Gets all files in the defined bucket
router.get("/", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});

// Streams file upload to Google Storage
router.post("/", multer.single("imgfile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(`vet certificate/${req.file.originalname}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");
        console.log("Success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
