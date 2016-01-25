/**
 * Created by remy on 14/01/16.
 */

var assert = require('assert');
var health = require('../../business/health');

describe('Health tests,', function () {

    describe('getHealth :', function () {
        it('Should return status success', function () {
            health(function (result) {
                assert.equal(result.status, 'success')
            })
        })
    })

});
