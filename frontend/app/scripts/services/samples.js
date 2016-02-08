/**
 * Created by remy on 25/01/16.
 */
'use strict';

angular.module('frontendApp')
  .factory('samplesByUsersFactory', function($http, CONSTANTS){
    var obj = {
      all : function(callback){
        $http.get(CONSTANTS.serverAddress + "samples/collection")
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
  });
