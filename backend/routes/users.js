/**
 * Created by remy on 30/11/15.
 */
'use strict';

var express = require('express');
var mongoose = require('../server/mongodb');

var router = express.Router();
const url = 'http://localhost:4000/users/';

router.get('/collection', getAllUsers);
router.post('/account', createAccount);
router.post('/connection', connection);

function getAllUsers(req, res) {
    User.find(function(err, result){
        if (err){
            res.send({status:'fail', value: err})
        } else {
            res.send({status: 'success', value: result})
        }
    })
}

function createAccount(req, res){
    var body = req.body;
    if (body.last_name != null && body.first_name != null && body.email != null && body.password != null){
        var user = new User({last_name: body.last_name, first_name: body.first_name, birth_date: body.birth_date, email: body.email, password:body.password })
        user.save(function(err, user){
            if (err){
                res.send({status: 'fail', value: err})
            } else {
                res.send({status: 'success', value: user})
            }
        })
    } else {
        res.send({status: 'fail', value: 'body params are incorrect'})
    }
}

function connection(req, res){
    var body = req.body;
    User.findOne({email: body.email, password: body.password}, function(err, result){
        if (err){
            res.send({status: 'fail', value: err})
        } else {
            res.send({status: 'success', value: result})
        }
    })
}

var userSchema = mongoose.Schema({last_name: String,
    first_name:String,
    birth_date: Date,
    path: String,
    email: String,
    password: String}
);
var User = mongoose.model('users', userSchema);

module.exports = router;