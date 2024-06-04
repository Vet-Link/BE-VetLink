const express = require('express');
const mysql = require("mysql");
const app = express();

app.get("/", (req, res) => {
    console.log("Response success");
    res.send("Response Success!");
});

app.get("/userData", async (req, res) => {
    const query = "SELECT * FROM users WHERE name = ?";
    pool.query(query, [ req.params.userID ], (error, results) => {
        if(!results[0]) {
            res.json({ status: "Not found!"});
        } else {
            res.json(results[0]);
        }
    });
});

app.use(express.json());
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});