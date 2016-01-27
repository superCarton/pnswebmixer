/**
 * Created by remy on 25/01/16.
 */
'use strict';

angular.module('frontendApp')
  .factory('Samples',["$http", function($http){
    var obj = {
      all : function(callback){
        $http.get("http://localhost:4000/samples/collection")
          .success(function(result){
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
