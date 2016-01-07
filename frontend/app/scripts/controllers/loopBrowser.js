'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoopBrowserCtrl
 * @description
 * # LoopBrowserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoopBrowserCtrl', function($scope) {
    $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

    $scope.fakeLoopList = [
      "basse.mp3",
      "kick_1.mp3",
      "kick_2.mp3",
      "snare.mp3"
    ];

  });
