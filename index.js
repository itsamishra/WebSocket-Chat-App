'use strict';


// Imports
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');


// Functions
// Checks for restricted keywords
function isRestricted(messageStr) {
    messageStr = messageStr.toLowerCase();

    for (let i = 0; i < RESTRICTED_KEYWORDS.length; i++) {
        if (messageStr.indexOf(RESTRICTED_KEYWORDS[i]) !== -1) {
            return true;
        }
    }

    return false;
}


// Constants
// Array of restricted keywords
const RESTRICTED_KEYWORDS = [
    'script',
    '<',
    '>',
    '/',
    '\\',
    'alert',
    'console'
];


// Gets port & index file
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Counts number of concurrent connections
let numConnections = 0;

// Creates and runs server
const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Creates connection to client(s)
const io = socketIO(server);

// Upon connection to client...
io.on('connection', (socket) => {
    console.log('Client connected');
    numConnections++;
    console.log(`${numConnections} connection(s)`);

    // ... listens for message to server
    socket.on('send_message_to_server', (data) => {
        // Makes sure message has no restricted keywords
        if (!isRestricted(data["message"].trim()) && data["message"].trim() != '') {
            io.sockets.emit('send_message_to_client', data);
        }
    });

    // Upon disconnection, prints prompt
    socket.on('disconnect', function () {
        console.log('Client disconnected')
        numConnections--;
        console.log(`${numConnections} connection(s)`);
    });
});