// Imports
var express = require('express')
var path = require('path');
var favicon = require('serve-favicon');
const {
    Client
} = require('pg');


// Gets all current messages
getMessages();

function getMessages() {
    // 👇 INSECURE DON'T DO THIS IN PRODUCTION 👇
    const connectionString = "postgres://pezyavflirolyx:47f51ca13d506bf4443db4c4e4aa995f52d3fc0e16e3df167d0c993073f551cf@ec2-75-101-133-29.compute-1.amazonaws.com:5432/d7ja08af1rhhkr"
    // 👆 INSECURE DON'T DO THIS IN PRODUCTION 👆
    const client = new Client({
        connectionString: connectionString,
        ssl: true,
    });

    client.connect();
    let messages = [];
    client.query('SELECT * FROM "Message" ORDER BY message_unix_timestamp ASC;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            messages.push(row);
        }
        client.end();

        // Starts webserver
        startServer(messages);
    });
}

function startServer(messages) {
    // Sets port (for Heroku)
    var port = process.env.PORT || 3000;

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
            messages: messages
        });
    });

    // Listens to port
    app.listen(port);
}