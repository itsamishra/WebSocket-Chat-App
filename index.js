// Imports
var express = require('express')
var path = require('path');
var favicon = require('serve-favicon');
const {
    Client
} = require('pg');

startServer();

function startServer() {
    // Sets port (for Heroku)
    const PORT = process.env.PORT || 3000;

    // Creates Express App
    var app = express();
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    // Favicon
    app.use(favicon(path.join(__dirname, 'images', 'icon.jpg')));

    // Homepage
    app.get('/', function (req, res) {
        // res.sendFile(path.join(__dirname + '/index.html'));
        res.render(__dirname + "/index.html", {
            port: PORT
        });
    });

    // Listens to port
    server = app.listen(PORT);

    const io = require("socket.io")(server)

    io.on('connection', (socket) => {
        function sendMessageToClient(data) {
            io.sockets.emit('send_message_to_client', data);

        };

        console.log('new user connected...');

        socket.username = "Anonymous";
        socket.on('send_message_to_server', (data) => {
            console.log(data);

            sendMessageToClient(data);
        });
    });
}