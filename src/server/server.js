const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const router = require('./route');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const handleSocketConnection = require('./socketConnection');
require('dotenv').config();


app.use(bodyParser.json());
app.use(router);

io.on('connection', (socket) => handleSocketConnection(io, socket));

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});