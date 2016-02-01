/**
 * Created by remy on 14/01/16.
 */

var assert = require('assert');
var user = require('../../business/users');

var body = null;

suite('Users business unit test,', function () {

    setup('Set the body variable', function () {
        body = {
            last_name: 'testName',
            first_name: 'test',
            birth_date: 738194400,
            email: 'test@test.com',
            password: 'azerty'
        }
    });

    suiteTeardown(function DropUserIfExist(done) {
        console.log('Excuting suite teardown :');
        user.deleteAccount(body, function (result) {
            console.log(result.status);
            done()
        })
    });

    suite('Create an user account with missing field :', function() {

        test('With missing email field, status fail', function(done){
            delete body.email;
            user.createAccount(body, function (result) {
                assert.equal(result.status, 'fail');
                done();
            });
        });

        test('With missing password field, status fail', function(done){
            body.email = 'test@test.com';
            delete body.password;
            user.createAccount(body, function (result) {
                assert.equal(result.status, 'fail');
                done();
            });
        });

    });

    suite('Create an user account :', function() {

        test('Without missing field, status success', function (done) {
            user.createAccount(body, function (result) {
                assert.equal(result.status, 'success');
                done();
            });
        });

        test('With an already taken email, status fail', function (done) {
            user.createAccount(body, function (result) {
                assert.equal(result.status, 'fail');
                done()
            })
        })

    });

    suite('User Connection', function () {

        test('Normal connection, status success', function(done){
            user.connection(body, function (result) {
                assert.equal(result.status, 'success');
                done()
            })
        });

        test('Should return fail if email is missing', function (done) {
            delete body.email;
            user.connection(body, function (result) {
                assert.equal(result.status, 'fail');
                done()
            })
        });

        test('Should return fail if password is missing', function (done) {
            delete body.email;
            user.connection(body, function (result) {
                assert.equal(result.status, 'fail');
                done()
            })
        })

    });

    suite('Get user collection :', function () {

        test('Should return status success', function (done) {
            user.getAll(function (result) {
                assert.equal(result.status, 'success');
                assert.equal(result.value.length > 0, true);
                done()
            })
        })

    });
});
