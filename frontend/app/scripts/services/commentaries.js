/**
 * Created by remy on 25/01/16.
 */

angular.module('frontendApp')
  .factory('Commentary',["$http", '$rootScope', function($http, $rootScope){
    var obj = {
      allBySampleId : function(sample_id, callback){
        $http.get("http://" + $rootScope.backendURL + "/commentary/view/"+sample_id)
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

