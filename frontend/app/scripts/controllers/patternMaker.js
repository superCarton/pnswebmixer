'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternMakerCtrl
 * @description
 * # PatternMakerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternMakerCtrl', function ($scope) {

    $scope.droppedObjects1 = [];

    $scope.onDropComplete1 = function(data) {
      var index = $scope.droppedObjects1.indexOf(data);
      if (index == -1) {
        $scope.droppedObjects1.push(data);
      }
    };

    $scope.toggleButton = function (event) {
      angular.element(event.currentTarget).toggleClass("fa-circle-thin");
      angular.element(event.currentTarget).toggleClass("fa-circle");
    };
  });
