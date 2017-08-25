
var express = require('express');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

let db = new sqlite3.Database('./db/users.db', sqlite3.OPEN_READONLY, (err) =>{
    if (err){
        return console.error("error opening database");
    }

    console.log("connected to users database");
});

app.post('/login', function(req, res){
    res.sendFile(__dirname + '/piano1.html');
});

app.listen(8080);

