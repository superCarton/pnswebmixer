/**
 * Created by remy on 21/01/16.
 */

var assert = require('assert');
var mongoose = require('../../connector/mongodb');

describe('Test the validity of the Mongo database,', function(){

    describe('If the connection is open return true :', function(){
        it('If the connection is open should return true', function () {
            assert.equal(mongoose.connections[0]._hasOpened, true)
        })
    })

});