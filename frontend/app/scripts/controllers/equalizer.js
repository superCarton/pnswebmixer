'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EqualizerCtrl
 * @description
 * # EqualizerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EqualizerCtrl', ['$scope', '$http', 'equalizer', 'audioPlayer', function ($scope, $http, equalizer, audioPlayer) {
    $scope.listOfMix = [];
      $scope.init = function() {
        equalizer.getMyMixList(function(data){
          //TODO Get the list of mix
          data.forEach(function(element) {
            var name = element.substr(element.lastIndexOf("/") +1);
            $scope.listOfMix.push(name);
          });
        }, function(error) {
          console.log(error);
        });
      }


    $scope.playMix = function(mix) {
      //TODO Get the mix by name
      equalizer.playMix(mix, function(data) {
        $scope.analyser = data;
      }, function(error) {
        console.log(error);
      });
    }

  }]);
