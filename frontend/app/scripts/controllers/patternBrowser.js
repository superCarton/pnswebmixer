'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternBrowserCtrl
 * @description
 * # PatternBrowserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternBrowserCtrl', ["$scope", 'Samples', function ($scope, Samples) {

    Samples.all(function(samples){
      $scope.samples = samples;
    })

  }]);
