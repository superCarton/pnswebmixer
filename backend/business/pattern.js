/**
 * Created by remy on 01/02/16.
 */

var mongoose = require('../connector/mongodb');

function savePattern(body, callback) {
    if (body.user_id == undefined) {
        callback({status: 'fail', value: 'you need to be authenticated'})
    } else {
        var pattern = new Pattern({
            user_id: body.user_id,
            name: body.name,
            loops: body.loops,
            beatmaking: body.beatmaking
        });
        pattern.save(function(err){
            if (err){
                callback({status: 'fail', value: err})
            } else {
                callback({status: 'success', value: 'pattern successfully saved'})
            }
        })
    }
}

function findPatternByUserId(userId, callback) {
    Pattern.find({user_id: userId}, function (err, result) {
        if (err || result == null) {
            callback({status: 'success', value: err})
        } else {
            callback({status: 'fail', value: result})
        }
    })
}

function getAllPattern(callback) {
    Pattern.find({}, function (err, result) {
        if (err || result == null) {
            callback({status: 'success', value: err})
        } else {
            callback({status: 'fail', value: result})
        }
    })
}

var patternSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    loops: [String],
    beatmaking: [[String]]
});

var Pattern = mongoose.model('pattern', patternSchema);

module.exports = {
    collection: getAllPattern,
    save: savePattern,
    getUserPattern: findPatternByUserId
};
