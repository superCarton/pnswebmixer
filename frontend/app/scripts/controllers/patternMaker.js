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

    var i = 0;
    var stopPlaying = false;
    var timer;

    // 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
    // représente le nombre de blocks pour 1 temps
    var pulsation = 2;

    var metronome = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8751.mp3");
    var kick = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8692.mp3");
    var snare = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8717.mp3");

    var animateLights = function () {
      metronome.pause();
      metronome.currentTime = 0;
      kick.pause();
      kick.currentTime = 0;
      snare.pause();
      snare.currentTime = 0;

      metronome.play();

      if(i == 0 || i == 4) {
        kick.play();
      }

      if(i == 2 || i == 6) {
        snare.play();
      }

      animateLight(i++);
      if (stopPlaying) {
        i = 0;
        return;
      } else if (i <= lightsIDs.length) {
        // 60000 = 1 minute en ms
        // divisé par la pulsation
        // multiplié par le tempo = delay entre chaque beat
        timer = setTimeout(animateLights, (60000 / pulsation) / document.getElementById("myTempo").value);
      } else {
        i = 0;
        animateLights();
      }
    };

    var animateLight = function (index) {
      if (index == 0) {
        $(lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      } else {
        $(lightsIDs[index - 1]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
        $(lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      }

    };

    $scope.playBeat = function () {
      $("#play").attr("disabled", true);
      stopPlaying = false;
      timer = 0;
      i = 0;
      $("#play").toggleClass("playing")
      animateLights();
    };

    $scope.stopBeat = function () {
      $("#play").attr("disabled", false);
      metronome.pause();
      metronome.currentTime = 0;
      kick.pause();
      kick.currentTime = 0;
      snare.pause();
      snare.currentTime = 0
      if ($("#play").hasClass("playing")) {
        clearTimeout(timer);
        stopPlaying = true;
        $("#play").toggleClass("playing");
        lightsIDs.forEach(function (light) {
          if ($(light).hasClass("fa-circle")) {
            $(light).toggleClass("fa-circle").toggleClass("fa-circle-thin");
          }
        });
      }
    };
  });
