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
    var lightsIDs = ["#light-1", "#light-2", "#light-3", "#light-4", "#light-5", "#light-6", "#light-7", "#light-8"]

    $scope.onDropComplete1 = function (data) {
      var index = $scope.droppedObjects1.indexOf(data);
      if (index == -1) {
        $scope.droppedObjects1.push(data);
      }
    };

    $scope.toggleButton = function (event) {
      angular.element(event.currentTarget).toggleClass("fa-circle-thin");
      angular.element(event.currentTarget).toggleClass("fa-circle");
    };

    $scope.playBeat = function () {
      $("#play").toggleClass("playing");
      setTimeout(function () {
        for (var i = 0; i < lightsIDs.length; i++) {
          $(lightsIDs[i]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
          console.log(lightsIDs[i]);
        }
      }, 1000);
    };

    $scope.stopBeat = function () {
      if ($("#play").hasClass("playing")) {
        $("#play").toggleClass("playing");
        $("#light-1").toggleClass("fa-circle-thin").toggleClass("fa-circle");
      }
    };

  });
