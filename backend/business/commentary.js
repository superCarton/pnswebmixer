/**
 * Created by remy on 18/01/16.
 */

var mongoose = require('../connector/mongodb');

const userDescription = 'http://localhost:4000/users/description/';
const viewComments = 'http://localhost:4000/commentary/view/';

function writeCommentary(body, params, callback) {
    Handler.findOne({sample_id: params.sample_id}, function (err, handler) {
        if (err) {
            callback({status: 'fail', value: err})
        } else {
            var commentary = new Commentary({
                date: new Date(),
                text: body.text,
                user_id: body.user_id,
                profile: userDescription + body.user_id
            });

            if (handler == null || handler == []) {
                // Create a new commentaryHandler
                var new_handler = new Handler({
                    sample_id: params.sample_id,
                    view_comments: viewComments + params.sample_id,
                    contents: [commentary]
                });
                new_handler.save(function (err, result) {
                    if (err) {
                        callback({status: 'fail', value: err})
                    } else {
                        callback({status: 'success', value: result})
                    }
                })
            } else {
                // Add a commentary to a commentaryHandler
                handler.contents.push(commentary);
                handler.save(function(err, result){
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

function viewCommentary(params, callback){
    Handler.findOne({sample_id: params.sample_id}, function(err, result){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
        }
    })
}

function testViewAllSimpleCommentary(callback){
    Commentary.find(function(err, result){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status: 'success', value: result})
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
    date: Date,
    text: String,
    user_id: mongoose.Schema.Types.ObjectId,
    profile: String
});

var commentaryHandlerSchema = mongoose.Schema({
    sample_id: mongoose.Schema.Types.ObjectId,
    view_comments: String,
    contents: [commentarySchema]
});

var Commentary = mongoose.model('commentary', commentarySchema);
var Handler = mongoose.model('commentaryHandler', commentaryHandlerSchema);


module.exports = {
    write: writeCommentary,
    view: viewCommentary,
    simpleCommentary: testViewAllSimpleCommentary,
    bigCommentary: testViewAllBigCommentary
};
