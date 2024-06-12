const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const router = require('./route');
const app = express();
const server = http.createServer(app);
const io =  socketIo(server, {
      cors: {
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });

const socketConnectionHandler = require('./socketConnection');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

io.on('connection', (socket) => socketConnectionHandler(io, socket));

const PORT = 8080;
server.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});