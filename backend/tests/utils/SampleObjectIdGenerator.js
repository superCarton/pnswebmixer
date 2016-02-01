/**
 * Created by remy on 01/02/16.
 */

var mongoose = require('../../connector/mongodb');
var findId = require('../../business/samples').find;

function generateId(callback){
    var id = new ObjectId();
    id.save(function(err, objectId){
        if (err){
            callback(-1)
        } else {
           findId(objectId._id, function(result){
               if (result.status == 'success'){
                   callback((generateId)())
               } else {
                   callback(objectId._id)
               }
           })
        }
    })
}

function removeId(callback){
    ObjectId.remove({}, function(err){
        if (err){
            callback({status: 'fail', value: err})
        } else {
            callback({status:'success'})
        }
    })
}

var ObjectIdHandler = mongoose.Schema({});
var ObjectId = mongoose.model('objectId', ObjectIdHandler);

module.exports = {
    generate: generateId,
    drop: removeId
};
