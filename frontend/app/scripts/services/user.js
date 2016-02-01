'use strict';

/**
 * @ngdoc function
 * @name sunApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sunApp
 */
angular.module('frontendApp')
	.factory("user", ['$http', '$rootScope', function($http, $rootScope) {
  		var url = "http://" + $rootScope.backendURL + "/users/";
      var obj = {

  			get:function(data, successCB, failCB) {
   				 $http.get(url+"login", data)
    				.success(function(data) {
              if(data.status=='success') {
                successCB(data.value);
             } else {
                    successCB(data.value);
             }
    				})
    				.error(function(error){
    					failCB(error);
    				});
  			},

  			delete:function(userId, successCB, failCB) {
  				$http.delete(url+userId)
  				.success(function() {
              successCB("OK")
  				})
  				.error(function(error) {
              failCB(error);
  				});
  			},
        register:function(data, successCB, failCB) {

        				$http.post(url+ "signup", data)
        				.success(function(result) {
                   if(result.status == "success") {
                     successCB(result.value);
                   } else {
                     failCB(result.value);
                   }
        				})
        				.error(function(error) {
                    failCB(error);
        				});
  			},
        connect:function(data, successCB, failCB) {

          $http.post(url+ "login", data)
            .success(function(result) {
              if(result.status == "success") {
                successCB(result.value);
              } else {
                failCB(result.value);
              }
            })
            .error(function(error) {
              failCB(error);
            });
        },
        search:function(data, successCB, failCB) {
          $http.get(url+data)
          .success(function(data) {
            if(data.status=='success') {
              successCB(data.data);
            }
          })
          .error(function(error) {
              failCB(error);
          })
        },
  			put:function(data, successCB, failCB) {
  				$http.put(url, data)
  				.success(function(data2) {
            console.log(data);
            console.log(data2);
              successCB("Success update");
  				})
  				.error(function(error) {
              failCB(error);
  				})
  			},
  			all:function(successCB, errorCB) {
  				$http.get(url)
  				.success(function(data) {
            if(data.status=='success') {
  					 successCB(data.data);
            }
  				})
  				.error(function(error) {
  					errorCB(error);
  				})
  			}
  		};
  		return obj;
  	}]);
