const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});