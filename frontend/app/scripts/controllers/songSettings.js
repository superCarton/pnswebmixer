'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SongSettingsCtrl
 * @description
 * # SongSettingsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SongSettingsCtrl', function ($scope, $rootScope) {

    var index;
    $scope.filter = '';

    $scope.init = function() {
      index = $rootScope.loopEffectId;
      $scope.frequency = $rootScope.songSet.frequency;
      $scope.quality= $rootScope.songSet.quality;
      $scope.delay = $rootScope.songSet.delay;
    };

    $scope.setFrequency = function() {
      $rootScope.songSet.frequency = $scope.frequency;
    };

    $scope.setQuality = function() {
      $rootScope.songSet.quality = $scope.quality;
    };

    $scope.changeDelay = function() {
      $rootScope.songSet.delay = $scope.delay;
    };

  });
