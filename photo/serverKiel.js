const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const keyFilename = require("../keyfile.json")
app.use(cors());
require('dotenv').config();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let projectId = "vetlink-425416"; // Get this from Google Cloud
//console.log(process.env.PRIVATE_KEY) // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  credentials: keyFilename
});
const bucket = storage.bucket("vetlink"); // Get this from Google Cloud -> Storage

// Gets all files in the defined bucket
app.get("/upload", async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
});
// Streams file upload to Google Storage
app.post("/upload", multer.single("imgfile"), (req, res) => {
  console.log("Made it /upload");
  const { username, email, password, passwordVerify } = req.body;
  console.log(username, email, password, passwordVerify )
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

// Start the server on port 8080 or as defined
app.listen(port, () => {
  console.log('Server is up and listening on ' + "http://localhost:" + port);
});

module.exports={
  username, 
  email, 
  password, 
  passwordVerify,
}
