var express = require('express');
var path = require('path');
/*
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'abbie',
    password : 'password'
})
*/

const app = express();

/*
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(function(username, password, done) {
      if (username === 'test' && password === 'test'){
	console.log(username);
	console.log(password);
      	return done(null, user);}
      if (err) { return done(err); }
      if (!username || !password) {
        return done(null, false, { message: 'Incorrect username.' });
      }

    }));
*/

app.use(express.static('public'));
app.post('/login', function(req, res){

});

/*
connection.connect(function(err){
    if (err){
        console.error('error connecting' + err.stack);
        return;
    }
})
*/
app.listen(8080);

