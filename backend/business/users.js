/**
 * Created by remy on 18/01/16.
 */

var mongoose = require('../connector/mongodb');

const url = 'http://localhost:4000/users/description/';

function getAllUsers(callback) {
    User.find(function (err, result) {
        if (err) {
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

function createAccount(body, callback) {
    if (body.email != undefined) {
        checkEmailValidity(body.email, function (result) {
            if (!result) {
                callback({status: 'fail', value: 'email already taken'})
            } else {
                if (body.last_name != undefined && body.first_name != undefined && body.password != undefined) {
                    var user = new User({
                        last_name: body.last_name,
                        first_name: body.first_name,
                        birth_date: body.birth_date,
                        email: body.email,
                        password: body.password
                    });
                    user.save(function (err, user) {
                        if (err) {
                            callback({status: 'fail', value: err})
                        } else {
                            user.description = url + user._id;
                            user.save(function (err, new_user) {
                                var result = new_user;
                                if (err) {
                                    callback({status: 'fail', value: err})
                                } else {
                                    // Whaaaat the fuuuuck ??
                                    delete result.password;
                                    callback({status: 'success', value: result})
                                }
                            })
                        }
                    })
                } else {
                    callback({status: 'fail', value: 'body params are incorrect'})
                }
            }
        })
    } else {
        callback({status: 'fail', value: 'email and password are required'})
    }
}

function checkEmailValidity(email, callback) {
    User.findOne({email: email}, function (err, user) {
        if (err) {
            callback(false)
        } else {
            if (user == null) {
                callback(true)
            } else {
                callback(false)
            }
        }
    })
}

function connection(body, callback) {
    if (body.email != undefined && body.password != undefined) {
        User.findOne({email: body.email, password: body.password}, function (err, user) {
            if (err) {
                callback({status: 'fail', value: err})
            } else {
                if (user == null) {
                    callback({status: 'fail', value: 'wrong email or password'})
                } else {
                    delete user.password;
                    callback({status: 'success', value: user})
                }
            }
        })
    } else {
        callback({status: 'fail', value: 'email and password are required'})
    }
}

function getDetailOfUser(params, callback) {
    User.findOne({_id: params.user_id}, function (err, result) {
        if (err) {
            callback({status: 'fail', value: err})
        } else {
            var user = result;
            delete user.email;
            delete user.password;
            delete user.last_name;
            callback({status: 'success', value: user})
        }
    })
}

function dropTableUser(callback) {
    User.remove({}, function (err) {
        if (err) {
            callback({status: 'fail', value: 'fail to drop database'})
        } else {
            callback({status: 'success', value: 'database successfully dropped'})
        }
    })
}

function removeOne(body, callback) {
    User.findOne({email: body.email, password: body.password}, function (err, result) {
        if (err) {
            callback({status: 'fail', value: err})
        } else {
            if (result == null) {
                callback({status: 'success', data: 'no data to remove'})
            } else {
                User.remove({email: body.email, password: body.password}, function (err) {
                    if (err) {
                        callback({status: 'fail', value: err})
                    } else {
                        callback({status: 'success', data: 'suppression done'})
                    }
                })
            }
        }
    })
}

var userSchema = mongoose.Schema({
        last_name: String,
        first_name: String,
        birth_date: Date,
        path: String,
        email: String,
        password: String,
        description: String
    }
);
var User = mongoose.model('users', userSchema);

module.exports = {
    getAll: getAllUsers,
    createAccount: createAccount,
    connection: connection,
    details: getDetailOfUser,
    drop: dropTableUser,
    deleteAccount: removeOne
};
