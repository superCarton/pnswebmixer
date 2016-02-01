/**
 * Created by remy on 01/02/16.
 */

var assert = require('assert');
var async = require('async');

var commentary = require('../../business/commentary');
var sampleId = require('../utils/SampleObjectIdGenerator');


var handler_id = [];
var sample_id = [];
var commentary_id = [];
var body;

suite('Commentary business unit test', function(){

    suiteSetup(function(done){
        sampleId.generate(function(id1){
            sample_id.push(id1);
            sampleId.generate(function(id1){
                sample_id.push(id1);
                sampleId.generate(function(id2){
                    sample_id.push(id2);
                    done()
                })
            })
        });
    });

    suiteTeardown(function(done){
        console.log('Excuting suite teardown :');
        async.eachSeries(handler_id, function(id, seriesCallback){
            (function(objectId){
                commentary.remove(objectId, function(){
                    seriesCallback()
                })
            })(id)
        }, function(err){
            if (err){
                console.log((new Date()).toString() + ' : ' + err)
            } else {
                sampleId.drop(function(){
                    handler_id = null;
                    sample_id = null;
                    body = null;
                    console.log('success');
                    done()
                })
            }
        });
    });

    setup(function(){
        body = {
            text: 'je suis un text',
            user_id: '56af892e25b313013bad0750',
            first_name: 'monNomEstTest'
        }
    });

    suite('Add a commentary', function(){

        test('in a empty handler', function(done){
            commentary.write(body, sample_id[0], function(result){
                if (result.status == 'success') {
                    handler_id.push(result.value._id);
                }
                assert.equal(result.status, 'success');
                assert.equal(result.value.contents.length, 1);
                done()
            })
        });

        test('in the same handler', function(done){
            commentary.write(body, sample_id[0], function(result){
                if (result.status == 'success') {
                    if (handler_id[0] != result.value._id.toString()){
                        handler_id.push(result.value._id);
                        assert(false)
                    }
                }
                assert.equal(result.status, 'success');
                assert.equal(result.value.contents.length, 2);
                commentary_id.push(result.value.contents[1]._id);
                done()
            })
        });

        test('with no logging', function(done){
            delete body.user_id;
            commentary.write(body, sample_id[0], function(result){
                assert.equal(result.status, 'fail');
                done()
            })
        });

        test('with empty text', function(done){
            body.text = '';
            commentary.write(body, sample_id[0], function(result){
                assert.equal(result.status, 'fail');
                done()
            })
        });

        test('Add in an other handler', function(done){
            commentary.write(body, sample_id[1], function(result){
                if (result.status == 'success') {
                    handler_id.push(result.value._id);
                }
                assert.equal(result.status, 'success');
                assert.equal(result.value.contents.length, 1);
                commentary_id.push(result.value.contents[0]._id);
                done()
            })
        });

        test('Add again in an other handler', function(done){
            commentary.write(body, sample_id[2], function(result){
                if (result.status == 'success') {
                    handler_id.push(result.value._id);
                }
                assert.equal(result.status, 'success');
                assert.equal(result.value.contents.length, 1);
                commentary_id.push(result.value.contents[0]._id);
                done()
            })
        })

    });

    suite('View commentaries', function(){

        test('First sample', function(done){
            commentary.view(sample_id[0], function(result){
                assert.equal(result.value.contents.length, 2);
                done()
            })
        });

        test('Second sample', function(done){
            commentary.view(sample_id[1], function(result2){
                assert.equal(result2.value.contents.length, 1);
                done()
            })
        })

    });

    suite('Remove One Commentary', function(){

        test('First sample', function(done){
            commentary.removeOne(handler_id[0], commentary_id[0], function(result){
                assert.equal(result.value.contents.length, 1);
                done()
            })
        });

        test('Second sample', function(done){
            commentary.removeOne(handler_id[1], commentary_id[1], function(result){
                assert.equal(result.value.contents.length, 0);
                done()
            })
        });

        test('Wrong sample_id', function(done){
            commentary.removeOne(handler_id[0], '000000000000000000000000', function(result){
                assert.equal(result.status, 'fail');
                assert.equal(result.value, 'no commentary to remove');
                done()
            })
        });

        test('Wrong handler_id', function(done){
            commentary.removeOne('000000000000000000000000', '000000000000000000000000', function(result){
                assert.equal(result.status, 'fail');
                assert.equal(result.value, 'no match handler');
                done()
            })
        })
    });

    suite('Remove One Handler', function(){
        test('Third handler', function(done) {
            commentary.remove(handler_id[2], function (result) {
                assert.equal(result.status, 'success');
                commentary.view(sample_id[2], function(result){
                    assert.equal(result.status, 'success');
                    assert(result.value.toString() == {});
                    delete handler_id[2];
                    done()
                })
            })
        })
    })
});
