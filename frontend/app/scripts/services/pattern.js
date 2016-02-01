/**
 * Created by vincent on 01/02/16.
 */

angular.module('frontendApp')
  .factory('PatternFactory', function ($http, $q, CONSTANTS) {
    var factory = {
      savePattern: function (json_to_send) {
        var deferred = $q.defer();
        $http.post(CONSTANTS.serverAddress + CONSTANTS.savePatternPath, json_to_send).then(function (data) {
          if (data.status == 'success') {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data.data);
          }
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
    return factory;
  });
