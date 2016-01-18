/**
 * Created by remy on 12/01/16.
 */


var express = require('express');
var router = express.Router();

var commentary = require('../business/commentary');

router.post('/post/:sample_id', writeCommentary);
router.get('/view/:sample_id', viewCommentary);
router.get('/simple', simpleCommetary);
router.get('/big', bigCommetary);

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

function simpleCommetary(req, res){
    commentary.simpleCommentary(function(result){
        res.send(result)
    })
}

function bigCommetary(req, res){
    commentary.bigCommentary(function(result){
        res.send(result)
    })
}

module.exports = router;
