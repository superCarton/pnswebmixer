/**
 * Created by remy on 18/01/16.
 */

var fs = require('fs');
var mongoose = require('../connector/mongodb');
var async = require('async');

var removeCommentaries = require('./commentary');

const path = 'http://localhost:4000/samples/download/';
const view = 'http://localhost:4000/commentary/view/';
const post = 'http://localhost:4000/commentary/post/';
const remove = 'http://localhost:4000/commentary/remove';

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

    var sample = new Sample({name: body.name, original_name: file.originalname, file_name: file.filename,
        encoding: extansion, download: url});
    sample.save(function(err, result){
        if (err){
            console.log('fail to save : ');
            console.log(err);
            callback({status:'fail', value:'fail to save file in MongoDB'})
        } else {
            result.view_comments = view+result._id;
            result.post_comment = post+result._id;
            result.remove_sample = remove+result._id;
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
    Sample.find(function(err, samples){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            async.eachSeries(samples, function(sample, wait){
                removeOneFile(sample, function(result){
                    if (result == 'success'){
                        wait()
                    } else {
                        wait(new Error(result))
                    }
                })
            }, function(err) {
                if (err) {
                    callback({status: 'fail', value: err})
                } else {

                    // On supprime tous les commentaires associés
                    removeCommentaries.drop(function(result){
                        if (result.status == 'success'){

                            // On supprime les samples en base de données
                            Sample.remove({}, function(err){
                                if (err){
                                    callback({status:'fail', value:'fail to drop database'})
                                } else {
                                    callback({status:'success', value:'database successfully dropped'})
                                }
                            })
                        } else {
                            callback({status:'fail', value:'fail to drop commentaries'})
                        }
                    })
                }
            })
        }
    });
}

function removeOneFile(file, callback){
    if (file.file_filename != undefined) {
        var path = __dirname + '/../uploads/' + file.file_name + '.' + file.encoding;
        fs.unlink(path, function (err) {
            if (err) {
                callback(err)
            } else {
                callback('success')
            }
        });
    } else {
        Sample.findOne({_id: file.id}, function(err, sample){
            if (err){
                callback({status: 'fail', value: err})
            } else {
                var path = __dirname + '/../uploads/' + sample.file_name + '.' + sample.encoding;
                fs.unlink(path, function (err) {
                    if (err) {
                        callback({status: 'success', value: err})
                    } else {
                        Sample.remove({_id: sample._id}, function(err){
                            if (err){
                                callback({status: 'fail', value: err})
                            } else {
                                // TODO remove one sample and all commentaries on it
                            }
                        })
                    }
                });
            }
        })
    }
}

var sampleSchema = mongoose.Schema({name: String,
    original_name:String,
    file_name: String,
    encoding: String,
    download: String,
    view_comments: String,
    post_comment: String,
    remove_sample: String}
);
sampleSchema.methods.ok = function () {
    console.log('file ' + this.name + ' successfuly save with path : ' + this.path);
};
var Sample = mongoose.model('samples', sampleSchema);

module.exports = {
    getAll: getAllFiles,
    save: saveFile,
    download: download,
    drop: removeAll,
    remove: removeOneFile
};
