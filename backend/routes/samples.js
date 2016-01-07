/**
 * Created by remy on 07/01/16.
 */

var express = require('express');
var router = express.Router();

var mongoose = require('../server/mongodb');

router.get('/collection', getAllFiles);
router.post('/test', testAddMongo);

function getAllFiles(req, res){
    console.log(req.body);
    res.send({hello:'salut'});
}

function testAddMongo(req, res){
    console.log(req.body);
    var sample = new Sample({name: req.body.name, path: req.body.path});
    sample.save(function(err, sample) {
        if (err) {
            console.log('fail to save');
        } else {
            sample.ok();
        }
        res.send({status: 'success'})
    });
}

var sampleSchema = mongoose.Schema({name : String, path : String}, {collection : 'samples'});
sampleSchema.methods.ok = function(){
  console.log('file '+this.name+' successfuly save with path : '+this.path);
};
var Sample = mongoose.model('Sample', sampleSchema);

module.exports = router;
