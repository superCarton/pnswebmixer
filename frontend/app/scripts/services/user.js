'use strict';

angular.module('frontendApp')
  .factory('UserFactory', function ($http, $q, CONSTANTS) {
    var factory = {

      loginToServer: function (json_to_send) {
        var deferred = $q.defer();
        $http.post(CONSTANTS.serverAddress + CONSTANTS.loginPath, json_to_send).then(function (data) {
          if (data.status == 'success') {
            deferred.resolve(data.value);
          } else {
            deferred.reject(data.value);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      signUpToServer: function (json_to_send) {
        var deferred = $q.defer();
        $http.post(CONSTANTS.serverAddress + CONSTANTS.signUpPath, json_to_send).then(function (data) {
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

    };

    return factory;
  });
