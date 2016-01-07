/**
 * Created by remy on 30/11/15.
 */

'use strict';

var app = require('../server/app');
var http = require('http');

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error){
    console.log('['+(new Date()).toString()+'] ERROR : A wild error appeared: ' + error);
}

function onListening(){
    console.log('['+(new Date()).toString()+'] INFO: Listening on port ' + port);
}