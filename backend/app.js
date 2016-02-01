/**
 * Created by remy on 30/11/15.
 */

var express = require("express");
var bodyParser = require("body-parser");
var multer = require('multer');


var health = require('./routes/health');
var users = require('./routes/users');
var samples = require('./routes/samples');
var commentary = require('./routes/commentary');
var pattern = require('./routes/pattern');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer({dest:'./uploads/'}).single('file')); // for parsing multipart/form-data
// dest origin begin where server is launch.

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); //"Origin, X-Requested-With, Content-Type, Accept"
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.get('/', function(req, res){
    res.send('<h1>Are you lost ? * &lt;--- You are here !</h1>');
});

app.use('/health', health);
app.use('/users', users);
app.use('/samples', samples);
app.use('/commentary', commentary);
app.use('/pattern', pattern);

module.exports = app;
