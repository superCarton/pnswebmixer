/**
 * Created by remy on 04/02/16.
 */

var assert = require('assert');
var async = require('async');

var pattern = require('../../business/pattern');
var body;

var patternId = [];

suite('Pattern business tests', function () {

    setup(function () {
        body = {
            user_id: '56af892e25b313013bad0750',
            name: 'my_pattern',
            loops: ['String1', 'String2'],
            beatmaking: [['String3', 'String4'], ['String5', 'String6']]
        }
    });

    suiteTeardown(function (done) {
        console.log('Executing suite teardown :');
        body = null;
        async.each(patternId, function (id, callback) {
                pattern.remove(id, function (result) {
                    if (result.status == 'err') {
                        callback(new Error(result.value))
                    } else {
                        callback()
                    }
                })
            },
            function (err) {
                if (err) {
                    console.log('error :');
                    console.log(err)
                }
                patternId = null;
                console.log('success');
                done()
            })
    });


    suite('Save pattern', function () {

        test('try saving when userid is undefined', function (done) {
            delete body.user_id;
            pattern.save(body, function (result) {
                if (result.status == 'success') {
                    patternId.push(result.value._id);
                    console.log(patternId);
                }
                assert.equal(result.status, 'fail');
                assert.equal(result.value, 'you need to be authenticated');
                done()
            })
        });

        test('normal saving', function (done) {
            pattern.save(body, function (result) {
                assert.equal(result.status, 'success');
                patternId.push(result.value._id);
                done()
            })
        });

        test('normal saving two', function(done){
            body.name = 'my_pattern_2';
            pattern.save(body, function (result) {
                assert.equal(result.status, 'success');
                patternId.push(result.value._id);
                done()
            })
        })
    });

    suite('Find one pattern', function(){

        test('find one pattern', function(done){
            pattern.find(patternId[0], function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value._id.toString(), patternId[0]);
                assert.equal(result.value.beatmaking.length, 2);
                done()
            })
        });

        test('test find one without patternId', function(done){
            pattern.find(undefined, function(result){
                assert.equal(result.status, 'fail');
                done()
            })
        })

    });

    suite('Find all pattern for one user', function(){

        test('find all pattern', function(done){
            pattern.getUserPattern('56af892e25b313013bad0750', function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value.length, 2);
                done()
            })
        });

        test('find when user haven\'t any pattern', function(done){
            pattern.getUserPattern('000000000000000000000000', function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value.length, 0);
                done()
            })
        })

    });

    suite('Find all pattern', function(){

        test('normally no error', function(done){
            pattern.collection(function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value.length, 2);
                done()
            })
        })

    });

    suite('Remove One pattern', function(){

        test('When patternId is not existing', function(done){
            pattern.remove('000000000000000000000000', function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value.n, 0);
                pattern.collection(function(all){
                    assert.equal(all.value.length, 2);
                    done()
                })
            })
        });

        test('With existing patternId', function(done){
            pattern.remove(patternId[0], function(result){
                assert.equal(result.status, 'success');
                assert.equal(result.value.n, 1);
                pattern.collection(function(all){
                    assert.equal(all.value.length, 1);
                    patternId.splice(0, 1);
                    done()
                })
            })
        })

    })



});
