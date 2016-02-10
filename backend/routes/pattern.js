/**
 * Created by remy on 01/02/16.
 */

var express = require('express');
var router = express.Router();

var pattern = require('../business/pattern');

router.get('/collection', collection);
router.get('/view/:userId', getUserPattern);
router.post('/save', savePattern);
router.post('/mark', giveAMark);
router.delete('/remove/:patternId', remove);
router.delete('/drop', drop);

function collection(req, res) {
    console.log('[' + (new Date()).toString() + '] : Get all patterns');
    pattern.collection(function (result) {
        res.send(result)
    })
}

function getUserPattern(req, res) {
    console.log('[' + (new Date()).toString() + '] : Get user patterns');
    pattern.getUserPattern(req.params.userId, function (result) {
        res.send(result)
    })
}

function savePattern(req, res) {
    console.log('[' + (new Date()).toString() + '] : Save pattern');
    if (req.body.user_id != undefined) {
        pattern.save(req.body, function (result) {
            res.send(result)
        })
    } else {
        res.send({status: 'fail', value: 'user_id is needed'})
    }
}

function remove(req, res) {
    console.log((new Date()).toString() + ' : Remone pattern');
    if (req.params.patternId != undefined && req.params.patternId != null) {
        pattern.remove(req.params.patternId, function (result) {
            res.send(result);
        })
    } else {
        res.send({status: 'fail', value: 'patternId is needed'})
    }
}

function drop(req, res) {
    pattern.drop(function (result) {
        res.send(result)
    })
}

function giveAMark(req, res) {
    if (req.body.user_id == undefined || req.body.pattern_id == undefined || req.body.mark == undefined) {
        res.send({status: 'fail', value: 'you need to send all require field'})
    } else {
        pattern.giveAMark(req.body.pattern_id, req.body.user_id, parseInt(req.body.mark), function(result){
            res.send(result)
        })
    }
}

module.exports = router;
