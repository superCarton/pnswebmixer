/**
 * Created by remy on 14/01/16.
 */

var assert = require('assert');
var user = require('../../business/users');

describe('Users business unit test,', function (){

    describe('Get user collection :', function(){
        it('Should return status success', function(){
            user.getAll(function(result){
                assert.equal(result.status, 'success')
            })
        })
    });

    describe('Create an user account :', function(){
        var body = {};
        it('Should return status fail if email is missing', function(){
             user.createAccount(body, function(result){
                 assert.equal(result.status, 'fail')
             })
        });
        it('Should return status fail if other field are missing too', function(){
            body.email = 'pnswebmixer@gmail.com';
            user.createAccount(body, function(result){
                assert.equal(result.status, 'fail')
            })
        });
        it('Should return status success otherwise', function(){
            body.last_name = 'lastname'; body.first_name = 'firstname'; body.password = 'password';
            user.createAccount(body, function(result){
                console.log(result);
                assert.equal(result.status, 'success')
            })
        });
        it('Should return status fail if we try to sign up with the same email', function(){
            console.log(body);
            user.createAccount(body, function(result){
                assert.equal(result.status, 'fail')
            })
        })
    });

    describe('User Connection', function(){
        var body = {};
        it('Should return fail if email or password is missing', function(){
            body.email = 'pnswebmixer@gmail.com';
            user.connection(body, function(result){
                assert.equal(result.status, 'fail')
            })
        })
    })

});
