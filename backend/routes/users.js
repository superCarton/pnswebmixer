/**
 * Created by remy on 30/11/15.
 */
'use strict';

var express = require('express');
var uuid = require('node-uuid');

var router = express.Router();

router.get('/caca', getAllUsers);


function getAllUsers(req, res) {
    console.log("GET ALL USERS");
    //console.log(req);
    console.log("prout");
    res.send({status:'success',content:'it works fine !'});
}

module.exports = router;