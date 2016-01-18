/**
 * Created by remy on 18/01/16.
 */

function getHealth(callback){
    var jsonResp = {
        status: 'success',
        data: 'health of webMixer server is good'
    };
    callback(jsonResp);
}

module.exports = getHealth;
