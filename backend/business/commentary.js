/**
 * Created by remy on 18/01/16.
 */

var mongoose = require('../connector/mongodb');
var async = require('async');

const viewComments = 'http://localhost:4000/commentary/view/';
const removePath = 'http://localhost:4000/commentary/remove/';

function writeCommentary(body, sample_id, callback) {
    if (body.user_id == undefined || body.first_name == undefined){
        callback({status: 'fail', value: 'you need to be identified'})
    } else if (body.text == undefined || body.text == '') {
        callback({status: 'fail', value: 'you can\'t post an empty message'})
    } else {
        Handler.findOne({sample_id: sample_id}, function (err, handler) {
            if (err) {
                callback({status: 'fail', value: err})
            } else {
                var commentary = new Commentary({
                    date: new Date(),
                    text: body.text,
                    user_id: body.user_id,
                    first_name: body.first_name
                });

                if (handler == null || handler == []) {
                    // Create a new commentaryHandler
                    var new_handler = new Handler({
                        sample_id: sample_id,
                        view_comments: viewComments + sample_id,
                        contents: [commentary]
                    });
                    new_handler.save(function (err, result) {
                        if (err) {
                            callback({status: 'fail', value: err})
                        } else {
                            result.remove_topic = removePath + result._id;
                            result.contents[0].remove_commentary = removePath + result._id + '/' + result.contents[0]._id;
                            result.save(function (err) {
                                if (err) {
                                    callback({status: 'fail', value: err})
                                } else {
                                    viewCommentary(sample_id, function(result){
                                        callback(result)
                                    })
                                }
                            })
                        }
                    })
                } else {
                    // Add a commentary to a commentaryHandler
                    handler.contents.push(commentary);
                    handler.save(function (err, result) {
                        if (err) {
                            callback({status: 'fail', value: err})
                        } else {
                            async.eachSeries(result.contents, function (commentary, SeriesCallback) {
                                (function addRemovedPath(com) {
                                    if (com.remove_commentary == undefined || com.remove_commentary == null) {
                                        com.remove_commentary = removePath + result._id + '/' + com._id;
                                    }
                                    SeriesCallback()
                                })(commentary)
                            }, function (err) {
                                if (err) {
                                    callback({status: 'fail', value: err})
                                } else {
                                    handler.save(function (err, final_result) {
                                        if (err) {
                                            callback({status: 'fail', value: err})
                                        } else {
                                            callback({status: 'success', value: final_result})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }
}

function viewCommentary(sample_id, callback){
    Handler.findOne({sample_id: sample_id}, function(err, result){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            if (result == null){
                result = {}
            }
            callback({status: 'success', value: result})
        }
    })
}

function removeOneHandler(handler_id, callback){
    Handler.remove({_id: handler_id}, function(err){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: 'Commentaries successfully removed'})
        }
    })
}

function removeOneCommentary(handler_id, com_id, callback){
    Handler.findOne({_id: handler_id}, function(err, result){
        if (err){
            callback({status: 'fail', value: err})
        } else if (result == null) {
            callback({status: 'fail', value: 'no match handler'})
        } else {
            var i = (function myIndexOf(arr, search) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]._id == search.toString()) {
                        return i;
                    }
                }
                return -1;
            })(result.contents, com_id);
            if (i != -1) {
                result.contents.splice(i, 1);
                result.save(function (err, result) {
                    if (err) {
                        callback({status: 'fail', value: err})
                    } else {
                        callback({status: 'success', value: result})
                    }
                })
            } else {
                callback({status: 'fail', value: 'no commentary to remove'})
            }
        }
    })
}

function removeAllHandler(callback){
    Handler.remove({}, function(err){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: 'All commentaries successfully removed'})
        }
    })
}

function testViewAllBigCommentary(callback){
    Handler.find(function(err, result){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

var commentarySchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    date: Date,
    text: String,
    remove_commentary: String
});

var commentaryHandlerSchema = mongoose.Schema({
    sample_id: mongoose.Schema.Types.ObjectId,
    view_comments: String,
    remove_topic: String,
    contents: [commentarySchema]
});

var Commentary = mongoose.model('commentary', commentarySchema);
var Handler = mongoose.model('commentaryHandler', commentaryHandlerSchema);


module.exports = {
    write: writeCommentary,
    view: viewCommentary,
    bigCommentary: testViewAllBigCommentary,
    drop: removeAllHandler,
    remove: removeOneHandler,
    removeOne: removeOneCommentary
};
