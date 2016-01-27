'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternBrowserCtrl
 * @description
 * # PatternBrowserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternBrowserCtrl', ["$scope", 'Samples', "$location", function ($scope, Samples, $location) {

    Samples.all(function(samples){
      $scope.samples = samples;
    });

    $scope.go = function(path, url){
      console.log(url);
      $location.path(path)
    }

  }]);
