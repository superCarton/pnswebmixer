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
            song_settings: body.song_settings,
            beatmaking: [],
            volumes_samples: body.volumes_samples,
            mute_samples: body.mute_samples,
            solo_samples: body.solo_samples
        });
        var iterator = 0;
        body.beatmaking.forEach(function (beat) {
            pattern.beatmaking.push([]);
            beat.forEach(function (string) {
                pattern.beatmaking[iterator].push(string)
            });
            iterator++;
        });
        pattern.save(function (err, result) {
            if (err) {
                callback({status: 'fail', value: err})
            } else {
                callback({status: 'success', value: result})
            }
        })
    }
}

function findOnePattern(patternId, callback) {
    Pattern.findOne({_id: patternId}, function (err, result) {
        if (err || result == null) {
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

function findPatternByUserId(userId, callback) {
    Pattern.find({user_id: userId}, function (err, result) {
        if (err || result == null) {
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

function getAllPattern(callback) {
    Pattern.find({}, function (err, result) {
        if (err || result == null) {
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

function removeOne(patternId, callback) {
    Pattern.remove({_id: patternId}, function (err, result) {
        if (err) {
            callback({status: 'err', value: err})
        } else {
            callback({status: 'success', value: result.result})
        }
    })
}

function removeAll(callback) {
    Pattern.remove({}, function (err) {
        if (err) {
            callback({status: 'err', value: err})
        } else {
            callback({status: 'success'})
        }
    })
}

function giveANote(pattern_id, user_id, mark, callback) {
    Pattern.findOne({_id: pattern_id}, function (err, pattern) {
        if (err) {
            callback({status: 'fail', value: err})
        } else if (pattern == null) {
            callback({status: 'fail', value: 'pattern is not existing'})
        } else {
            if (pattern.personal_mark != undefined) {
                var global_mark = 0;
                var finded = false;
                pattern.personal_mark.forEach(function (items) {
                    if (items.user_id == user_id) {
                        finded = true;
                        items.mark = mark
                    }
                    global_mark += items.mark;
                });
                if (!finded) {
                    pattern.personal_mark.push({user_id: user_id, mark: mark});
                    global_mark += mark
                }
                pattern.global_mark = (global_mark / pattern.personal_mark.length);
                pattern.save(function (err, pattern_final) {
                    if (err) {
                        callback({status: 'success', value: err})
                    } else {
                        callback({status: 'success', value: pattern_final})
                    }
                })
            } else {
                pattern.personal_mark = [{user_id: user_id, mark: mark}];
                pattern.global_mark = mark;
                pattern.save(function (err, result) {
                    if (err) {
                        callback({status: 'fail', value: err})
                    } else {
                        callback({status: 'success', value: result})
                    }
                })
            }

        }
    })
}


var patternSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    loops: [String],
    beatmaking: [],
    volumes_samples: [Number],
    mute_samples: [Boolean],
    solo_samples: [Boolean],
    global_mark: Number,
    personal_mark: [{
        user_id: mongoose.Schema.Types.ObjectId,
        mark: Number
    }],
    song_settings: [{
        frequency: Number,
        quality: Number,
        gain: Number,
        delay: Number
    }]
});

var Pattern = mongoose.model('pattern', patternSchema);

module.exports = {
    collection: getAllPattern,
    save: savePattern,
    getUserPattern: findPatternByUserId,
    find: findOnePattern,
    remove: removeOne,
    drop: removeAll,
    giveAMark: giveANote
};
