'use strict';
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

app.post('/login', function(req, res){
    req.checkBody('username', 'Username required').notEmpty();
    req.sanitize('username').escape();
    req.sanitize('username').trim();

    req.checkBody('password', 'Password required').notEmpty();

    var errors = req.getValidationResult();

    let db = new sqlite3.Database('./db/users.db', sqlite3.OPEN_READONLY, (err) =>{
        if (err){
            return console.error("error opening database");
        }
        console.log("connected to users database");
        
    });

    db.each("SELECT * FROM login WHERE username = " + "'" + req.body.username + "'" + " AND password = " + "'" + req.body.password + "'", function(err, row){
       if (row.username != null && row.password != null){
            res.sendFile(__dirname + '/piano1.html');
       }

       if (err){
            console.log('error occurred');
            res.sendFile(__dirname + '/public/index.html');
       }
        
    });

    db.close();
});

/*
app.post('/piano', function(req,res){
    console.log('received audio', req.body);
    var writeStream = fs.createWriteStream('sample.wav');
    fs.writeFile(writeStream);
    req.pipe(writeStream);
    res.status(200);

})
*/

app.listen(8080);

