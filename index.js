var express = require('express')
var path = require('path');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000;

var app = express()
app.use(favicon(path.join(__dirname, 'images', 'icon.jpg')));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port)