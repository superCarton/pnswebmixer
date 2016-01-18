/**
 * Created by remy on 12/01/16.
 */


var express = require('express');
var mongoose = require('../connector/mongodb');

var router = express.Router();

const userDescription = 'http://localhost:4000/users/description/';

router.post('/post/:sample_id', writeCommentary);
router.get('/view/:sample_id', viewCommentary);

function writeCommentary(req, res) {
    var body = req.body;
    Handler.findOne({sample_id: req.params.sample_id}, function (err, handler) {
        if (err) {
            res.send({status: 'fail', value: err})
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
                    sample_id: req.params.sample_id,
                    contents: [commentary]
                });
                new_handler.save(function (err, result) {
                    if (err) {
                        res.send({status: 'fail', value: err})
                    } else {
                        res.send({status: 'success', value: result})
                    }
                })

            } else {
                // Add a commentary to a commentaryHandler
                handler.contents.push(commentary);
                handler.save(function(err, result){
                    if (err) {
                        res.send({status: 'fail', value: err})
                    } else {
                        res.send({status: 'success', value: result})
                    }
                })
            }
        }
    })
}

function viewCommentary(req, res){
    Handler.findOne({sample_id: req.params.sample_id}, function(err, result){
        if (err){
            res.send({status: 'fail', value: err})
        } else {
            res.send({status: 'success', value: result})
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
    contents: [commentarySchema]
});

var Commentary = mongoose.model('commentary', commentarySchema);
var Handler = mongoose.model('commentaryHandler', commentaryHandlerSchema);

module.exports = router;
