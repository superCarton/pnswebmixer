/**
 * Created by remy on 25/01/16.
 */

angular.module('frontendApp')
  .factory('commentsFactory',["$http", '$rootScope', '$q', function($http, $rootScope, $q){
    var obj = {
      allBySampleId : function(sample_id){
        var deferred = $q.defer();
        $http.get("http://" + $rootScope.backendURL + "/commentary/view/" + sample_id)
          .success(function(result){
            console.log(result);
            if (result.status == 'success'){
              deferred.resolve(result.value);
             // callback(result.value)
            } else {
             // callback('fail')
              deferred.reject('fail');
            }
          })
          .error(function(err){
            deferred.reject(err);
          });

        return deferred.promise;
      },
      commentSample : function(sample_id, first_name, user_id, comment){
        var deferred = $q.defer();
        $http.post("http://" + $rootScope.backendURL + "/commentary/post/" + sample_id,
          { 'user_id' : user_id, 'first_name' : first_name,
          'text': comment}
        ).success(function(result){
            console.log(result);
            if (result.status == 'success'){
              deferred.resolve(result.value);
            } else {
              deferred.reject('fail');
            }
          })
          .error(function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      }
    };
    return obj;
  }]);

