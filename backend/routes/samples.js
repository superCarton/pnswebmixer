/**
 * Created by remy on 07/01/16.
 */

var express = require('express');
var router = express.Router();

var samples = require('../business/samples');

router.get('/collection', getAllFiles);
router.post('/upload', saveFile);
router.get('/download/:encoding/:id', download);
router.delete('/drop', removeAll);
router.delete('/remove/:id', removeOne);

function getAllFiles(req, res) {
    samples.getAll(function(result){
        res.send(result)
    })
}

function saveFile(req, res) {
    samples.save(req.body, req.file, function(result){
        res.send(result)
    })
}

function download(req, res){
    samples.download(req.params, function(sample, contentType){
        if (sample != 'fail') {
            res.writeHead(200, contentType);
            res.end(sample, 'binary');
        } else {
            res.status(404).send({status: 'fail', value: 'file not found'})
        }
    })
}

function removeAll(req, res){
    samples.drop(function(result){
        res.send(result)
    })
}

function removeOne(req, res){
    samples.remove(req.params.id, function(result){
        res.send({status: result})
    })
}

module.exports = router;
