// // Imports
// var express = require('express')
// var path = require('path');
// var favicon = require('serve-favicon');


// // Sets port (for Heroku)
// const PORT = process.env.PORT || 3000;

// // Creates Express App
// var app = express();
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

// // Favicon
// app.use(favicon(path.join(__dirname, 'images', 'icon.jpg')));

// // Homepage
// app.get('/', function (req, res) {
//     // res.sendFile(path.join(__dirname + '/index.html'));
//     res.render(__dirname + "/index.html", {
//         port: PORT
//     });
// });

// // Listens to port
// server = app.listen(PORT);

// const io = require("socket.io")(server)

// io.sockets.on('connection', (socket) => {
//     function sendMessageToClient(data) {
//         io.sockets.emit('send_message_to_client', data);

//     };

//     console.log('new user connected...');

//     socket.username = "Anonymous";
//     socket.on('send_message_to_server', (data) => {
//         console.log(data);

//         sendMessageToClient(data);
//     });
// });


'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

io.on('send_message_to_server', (data) => {
    console.log('send_message_to_server');
    console.log(data);
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);