/**
 * Created by remy on 30/11/15.
 */
'use strict';

var express = require('express');
var router = express.Router();

var users = require('../business/users');

router.get('/collection', getAllUsers);
router.post('/signup', createAccount);
router.post('/login', connection);
router.get('/description/:user_id', getDetailOfUser);
router.delete('/drop', dropTableUser);

function getAllUsers(req, res) {
    users.getAll(function(result){
        res.send(result)
    })
}

function createAccount(req, res){
    console.log((new Date()).toString() + ' : Create account');
    users.createAccount(req.body, function(result){
        res.send(result)
    })
}

function connection(req, res){
    users.connection(req.body, function(result){
        res.send(result)
    })
}

function getDetailOfUser(req, res){
    users.details(req.params, function(result){
        res.send(result)
    })
}

function dropTableUser(req, res){
    users.drop(function(result){
        res.send(result)
    })
}

module.exports = router;
