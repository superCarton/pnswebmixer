/**
 * Created by remy on 04/02/16.
 */

var samples = require('../../business/samples');
var assert = require('assert');
var fs = require('fs');

var params;

suite('Sample unit test', function(){

    setup(function(){
        params = {
            file_name: '0ad40aaeaa049d558933265d8b511679',
            encoding: 'jpeg'
        }
    });

    suite('Download a file', function(){

        test('normal download', function(done){
            samples.download(params, function(sample, contentType){
                assert.equal(Buffer.isBuffer(sample), true);
                assert(sample != null);
                assert.equal(contentType['Content-Type'], 'image/'+params.encoding);
                done()
            })
        });

        test('wrong file', function(done){
            params.file_name = '00000000000000000000000000000000';
            samples.download(params, function(sample, contentType) {
                assert.equal(sample, 'fail');
                done()
            })
        })

    })

});
