/**
 * Created by remy on 30/11/15.
 */
'use strict';

var express = require('express');
var mongoose = require('../server/mongodb');

var router = express.Router();
const url = 'http://localhost:4000/users/description/';

router.get('/collection', getAllUsers);
router.post('/account', createAccount);
router.post('/connection', connection);
router.get('/description/:user_id', getDetailOfUser);
router.delete('/drop', dropTableUser);

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
                user.description = url+user._id;
                user.save(function(err, new_user){
                    var result = new_user;
                    if (err){
                        res.send({status: 'fail', value: err})
                    } else {
                        console.log(result.password);
                        // Whaaaat the fuuuuck ??
                        delete result['password'];
                        console.log(result.password);
                        res.send({status: 'success', value: result})
                    }
                })
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
            result.delete(password);
            res.send({status: 'success', value: result})
        }
    })
}

function getDetailOfUser(req, res){
    User.findOne({_id: req.params.user_id}, function(err, result){
        if (err) {
            res.send({status: 'fail', value: err})
        } else {
            console.log(result);
            var user = result;
            delete user.email;
            delete user.password;
            delete user.last_name;
            console.log(user);
            console.log(user.email);
            res.send({status: 'success', value: user})
        }
    })
}

function dropTableUser(req, res){
    User.remove({}, function(err) {
        if (err) {
            res.send({status: 'fail', value: 'fail to drop database'})
        } else {
            res.send({status: 'success', value: 'database successfully dropped'})
        }
    })
}

var userSchema = mongoose.Schema({last_name: String,
    first_name:String,
    birth_date: Date,
    path: String,
    email: String,
    password: String,
    description: String}
);
var User = mongoose.model('users', userSchema);

module.exports = router;