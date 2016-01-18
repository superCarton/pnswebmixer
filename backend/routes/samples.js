/**
 * Created by remy on 07/01/16.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

var upload = multer({dest: './uploads/'});
var mongoose = require('../server/mongodb');

const path = 'http://localhost:4000/samples/download/';
const view = 'http://localhost:4000/commentary/view/';
const post = 'http://localhost:4000/commentary/post/';

router.get('/collection', getAllFiles);
router.post('/upload', upload.single('file'), saveFile);
router.get('/download/:encoding/:id', download);
router.delete('/dropDB', removeAll);

function getAllFiles(req, res) {
    Sample.find(function (err, samples){
        if (err){
            res.send({status: 'fail', value: err})
        } else  {
            res.send({status: 'success', value: samples})
        }
    })
}

function saveFile(req, res) {
    var extansion = (req.file.mimetype.split('/'))[1];
    fs.rename(__dirname+'/../uploads/'+req.file.filename, __dirname+'/../uploads/'+req.file.filename+'.'+extansion);
    var url = path + extansion + '/'+ req.file.filename;

    var sample = new Sample({name: req.body.name, original_name: req.file.originalname, encoding: extansion,
        download: url});
    sample.save(function(err, result){
        if (err){
            console.log('fail to save : ');
            console.log(err);
            res.send({status:'fail', value:'fail to save file in MongoDB'})
        } else {
            result.view_comment = view+result._id;
            result.post_comment = post+result._id;
            result.save(function(err, result){
                if (err){
                    res.send({status:'fail', value: err})
                } else {
                    res.send({status:'success', value: result})
                }
            })
        }
    });
}

function download(req, res){
    var sample = fs.readFileSync(__dirname +'/../uploads/'+ req.params.id + '.' + req.params.encoding);
    var contentType = {'Content-Type': null};
    if (req.params.encoding == 'mp3' || req.params.encoding == 'mpeg'){
        contentType['Content-Type'] = 'audio/'+req.params.encoding;
    } else {
        contentType['Content-Type'] = 'image/'+req.params.encoding;
    }
    console.log(contentType);
    res.writeHead(200, contentType);
    res.end(sample, 'binary');
}

function removeAll(req, res){
    Sample.remove({}, function(err){
        if (err){
            res.send({status:'fail', value:'fail to drop database'})
        } else {
            res.send({status:'success', value:'database successfully dropped'})
        }
    })
}

var sampleSchema = mongoose.Schema({name: String,
    original_name:String,
    encoding: String,
    download: String,
    view_comment: String,
    post_comment: String}
);
sampleSchema.methods.ok = function () {
    console.log('file ' + this.name + ' successfuly save with path : ' + this.path);
};
var Sample = mongoose.model('samples', sampleSchema);

module.exports = router;
