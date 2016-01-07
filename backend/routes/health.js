/**
 * Created by remy on 30/11/15.
 */

var express = require('express');
var router = express.Router();

router.get('/', getHealth);

function getHealth(req, res){
    console.log('['+(new Date()).toString()+'] INFO: GET health');

    var jsonResp = {
        status : 'success',
        data : 'health of master is good'
    };

    res.send(jsonResp);
}

module.exports = router;
