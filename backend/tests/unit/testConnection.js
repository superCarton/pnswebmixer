/**
 * Created by remy on 21/01/16.
 */

var assert = require('assert');
var mongoose = require('../../connector/mongodb');

suite('Test the validity of the Mongo database,', function(){

    suite('If the connection is open return true :', function(){
        test('If the connection is open should return true', function () {
            assert.equal(mongoose.connections[0]._hasOpened, true)
        })
    })

});