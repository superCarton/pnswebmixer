/**
 * Created by vincent on 01/02/16.
 */

angular.module('frontendApp')
  .factory('PatternFactory', function ($http, $q, CONSTANTS) {
    var factory = {

      savePattern: function (json_to_send) {
        var deferred = $q.defer();
        $http.post(CONSTANTS.serverAddress + CONSTANTS.savePatternPath, json_to_send).then(function (data) {
          if (data.data.status == 'success') {
            deferred.resolve(data.data.value);
          } else {
            deferred.reject(data.data.value);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      giveAMark: function(json_to_send){
        var deferred = $q.defer();
        $http.post(CONSTANTS.serverAddress + CONSTANTS.giveAMArk, json_to_send).then(function (data){
          if (data.data.status == 'success') {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data.data);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      loadAllPatterns: function () {
        var deferred = $q.defer();
        $http.get(CONSTANTS.serverAddress + CONSTANTS.getAllPatternsPath).then(function (data) {
          if (data.data.status == 'success') {
            deferred.resolve(data.data.value);
          } else {
            deferred.reject(data.data.value);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      loadMyPatterns: function (id) {
        var deferred = $q.defer();
        $http.get(CONSTANTS.serverAddress + CONSTANTS.getMyPatternsPath + id).then(function (data) {
          if (data.data.status == 'success') {
            deferred.resolve(data.data.value);
          } else {
            deferred.reject(data.data.value);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
    return factory;
  });
