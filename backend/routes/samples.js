/**
 * Created by remy on 07/01/16.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

var upload = multer({dest: './uploads/'});
var samples = require('./../uploads/samples.json');

var mongoose = require('../server/mongodb');
const path = 'http://localhost:4000/samples/download/';

router.get('/collection', getAllFiles);
router.post('/test', testAddMongo);
router.post('/upload', upload.single('file'), saveFile);
router.get('/download/:name', download);

function getAllFiles(req, res) {
    Sample.find(function (err, samples){
        if (err){
            res.status(500).send({status:'error'})
        } else  {
            res.send(samples)
        }
    })
}

function testAddMongo(req, res) {
    console.log(req.body);
    var sample = new Sample({name: req.body.name, path: path+req.body.name});
    sample.save(function (err, sample) {
        if (err) {
            console.log('fail to save');
        } else {
            sample.ok();
        }
        res.send({status: 'success'})
    });
}

function saveFile(req, res) {
    // TODO save with fs
    console.log(req.headers);
    console.log(req.file);
    console.log(req.body);
    res.send("ok");

    // Save in bdd
    /*var sample = new Sample({name: req.body.name, file: req.body.file, path: req.body.file});
    sample.save(function (err, sample) {
        if (err) {
            console.log('fail to save');
            res.status(500).send({status:'fail'})
        } else {
            sample.ok();
            res.send({status: 'success'})
        }
    })*/
}

function download(req, res){
    var sample = fs.readFileSync(__dirname +'/../uploads/'+ req.params.name);
    res.writeHead(200, { 'Content-Type':'audio/mpeg' });
    res.end(sample, 'binary');
}

var sampleSchema = mongoose.Schema({name: String, file:String, path: String}, {collection: 'samples'});
sampleSchema.methods.ok = function () {
    console.log('file ' + this.name + ' successfuly save with path : ' + this.path);
};
var Sample = mongoose.model('Sample', sampleSchema);

module.exports = router;
