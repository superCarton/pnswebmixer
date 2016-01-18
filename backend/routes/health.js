/**
 * Created by remy on 30/11/15.
 */

var express = require('express');
var router = express.Router();

var health = require('../business/health');

router.get('/', getHealth);

function getHealth(req, res){
    health(function(result){
        res.send(result)
    })
}

module.exports = router;
