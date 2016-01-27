/**
 * Created by remy on 25/01/16.
 */

angular.module('frontendApp')
  .factory('Commentary',["$http", function($http){
    var obj = {
      allBySampleId : function(sample_id, callback){
        $http.get("http://localhost:4000/commentary/view/"+sample_id)
          .success(function(result){
            console.log(result);
            if (result.status == 'success'){
              callback(result.value)
            } else {
              callback('fail')
            }
          })
          .error(function(err){
            callback('fail')
          })
      }
    };
    return obj;
  }]);

