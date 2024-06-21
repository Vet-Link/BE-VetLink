const express = require('express');
const http = require('http');
const cors = require('cors')
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
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

io.on('connection', (socket) => socketConnectionHandler(io, socket));

const PORT = 8080;
server.listen(PORT, () => {
    console.log("Server is up and listening on " + "http://localhost:" + PORT);
});
