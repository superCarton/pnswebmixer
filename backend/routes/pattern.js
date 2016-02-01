/**
 * Created by remy on 01/02/16.
 */

var express = require('express');
var router = express.Router();

var pattern = require('../business/pattern');

router.get('/collection', collection);
router.get('/view/:userId', getUserPattern);
router.post('/save', savePattern);

function collection(req, res){
    pattern.collection(function(result){
        res.send(result)
    })
}

function getUserPattern(req, res){
    pattern.getUserPattern(req.params.userId, function(result){
        res.send(result)
    })
}

function savePattern(req, res){
    if (req.body.user_id != undefined) {
        pattern.save(req.body, function (result) {
            res.send(result)
        })
    } else {
        res.send({status: 'fail', value: 'user_id is needed'})
    }
}

module.exports = router;
