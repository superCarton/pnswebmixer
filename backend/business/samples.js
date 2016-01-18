/**
 * Created by remy on 18/01/16.
 */

var fs = require('fs');
var mongoose = require('../connector/mongodb');

const path = 'http://localhost:4000/samples/download/';
const view = 'http://localhost:4000/commentary/view/';
const post = 'http://localhost:4000/commentary/post/';

function getAllFiles(callback) {
    Sample.find(function (err, samples){
        if (err){
            callback({status: 'fail', value: err})
        } else  {
            callback({status: 'success', value: samples})
        }
    })
}

function saveFile(body, file, callback) {
    var extansion = (file.mimetype.split('/'))[1];
    fs.rename(__dirname+'/../uploads/'+file.filename, __dirname+'/../uploads/'+file.filename+'.'+extansion);
    var url = path + extansion + '/'+ file.filename;

    var sample = new Sample({name: body.name, original_name: file.originalname, encoding: extansion,
        download: url});
    sample.save(function(err, result){
        if (err){
            console.log('fail to save : ');
            console.log(err);
            callback({status:'fail', value:'fail to save file in MongoDB'})
        } else {
            result.view_comments = view+result._id;
            result.post_comment = post+result._id;
            result.save(function(err, result){
                if (err){
                    callback({status:'fail', value: err})
                } else {
                    callback({status:'success', value: result})
                }
            })
        }
    });
}

function download(params, callback){
    var sample;
    try {
        sample = fs.readFileSync(__dirname + '/../uploads/' + params.id + '.' + params.encoding);
    } catch (error){
        sample = 'fail'
    }
    var contentType = {'Content-Type': null};
    if (params.encoding == 'mp3' || params.encoding == 'mpeg'){
        contentType['Content-Type'] = 'audio/' + params.encoding;
    } else {
        contentType['Content-Type'] = 'image/' + params.encoding;
    }
    callback(sample, contentType);
}

function removeAll(callback){
    // TODO remove all samples on hard drive
    // TODO remove all commentary for each samples
    Sample.remove({}, function(err){
        if (err){
            callback({status:'fail', value:'fail to drop database'})
        } else {
            callback({status:'success', value:'database successfully dropped'})
        }
    })
}

var sampleSchema = mongoose.Schema({name: String,
    original_name:String,
    encoding: String,
    download: String,
    view_comments: String,
    post_comment: String}
);
sampleSchema.methods.ok = function () {
    console.log('file ' + this.name + ' successfuly save with path : ' + this.path);
};
var Sample = mongoose.model('samples', sampleSchema);

module.exports = {
    getAll: getAllFiles,
    save: saveFile,
    download: download,
    drop: removeAll
};
