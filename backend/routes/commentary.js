/**
 * Created by remy on 12/01/16.
 */


var express = require('express');
var router = express.Router();

var commentary = require('../business/commentary');

router.post('/post/:sample_id', writeCommentary);
router.get('/view/:sample_id', viewCommentary);
router.get('/collection', bigCommetary);
router.delete('/remove/:topic_id', removeOneHandler);
router.delete('/remove/:topic_id/:com_id', removeOneCommentary);
router.delete('/drop', removeAllHandler);

function writeCommentary(req, res) {
    commentary.write(req.body, req.params, function(result){
        res.send(result)
    })
}

function viewCommentary(req, res){
    commentary.view(req.params, function(result){
        res.send(result)
    })
}

function bigCommetary(req, res){
    commentary.bigCommentary(function(result){
        res.send(result)
    })
}

function removeAllHandler(req, res){
    commentary.drop(function(result){
        res.send(result)
    })
}

function removeOneHandler(req, res){
    commentary.remove(req.params.topic_id, function(result){
        res.send(result)
    })
}

function removeOneCommentary(req, res){
    commentary.removeOne(req.params.topic_id, req.params.com_id, function(result){
        res.send(result)
    })
}

module.exports = router;
