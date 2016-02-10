'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function (audioPlayer, $scope, $rootScope) {

    var context = audioPlayer.initAudio();
    $rootScope.analyser = context.createAnalyser();
    initAnalyser();
    draw();
    drawBar();

    function initAnalyser() {

      $rootScope.analyser.fftSize = 2048;
      $scope.dataArray = new Uint8Array($rootScope.analyser.frequencyBinCount);
      $scope.canvasCtx =document.getElementById("song-visualize").getContext("2d");
      $scope.canvasCtx.clearRect(0, 0, 400, 55);


      $scope.canvasBar = document.getElementById("song-visualize-bar");
      $scope.canvasBarCtx = $scope.canvasBar.getContext("2d");
      $scope.canvasBarHeight = $scope.canvasBar.height;
      $scope.canvasBarWidth = $scope.canvasBar.width;
      $scope.canvasBarCtx.clearRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
    }

    function draw() {

      requestAnimationFrame(draw);
      $rootScope.analyser.getByteTimeDomainData($scope.dataArray);
      $scope.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      $scope.canvasCtx.fillRect(0, 0, 400, 155);
      $scope.canvasCtx.lineWidth = 2;
      $scope.canvasCtx.strokeStyle = 'rgb(30, 30, 30)';

      $scope.canvasCtx.beginPath();
      $scope.sliceWidth = 400 * 1.0 / $rootScope.analyser.frequencyBinCount;
      var x = 0;
      for(var i = 0; i < $rootScope.analyser.frequencyBinCount; i++) {

        var v = $scope.dataArray[i] / 128.0;
        var y = v * 55;

        if(i === 0) {
          $scope.canvasCtx.moveTo(x, y);
        } else {
          $scope.canvasCtx.lineTo(x, y);
        }
        x += $scope.sliceWidth;
      }
      $scope.canvasCtx.lineTo(400, 55/2);
      $scope.canvasCtx.stroke();
    }

    function drawBar() {

      requestAnimationFrame(drawBar);
      $rootScope.analyser.getByteFrequencyData($scope.dataArray);
      $scope.canvasBarCtx.fillStyle = 'rgb(0, 0, 0)';
      $scope.canvasBarCtx.fillRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
      var barWidth = ($scope.canvasBarWidth / $rootScope.analyser.frequencyBinCount) * 30;
      var barHeight;
      var x = 0;
      $scope.canvasBarLength = $rootScope.analyser.frequencyBinCount;
      $scope.canvasBarUnit = $rootScope.analyser.frequencyBinCount / 6;
      $scope.colors = ['#FF0000','#00FF0C', "#0000FF", "#EFF704", "#7189DE", "#00FFED", "#FF00D0"];
      for(var i = 0; i <  $rootScope.analyser.frequencyBinCount;) {
        barHeight = $scope.dataArray[i] / 2;
        $scope.canvasBarCtx.fillStyle = $scope.colors[Math.floor(i / $scope.canvasBarUnit)];
        $scope.canvasBarCtx.fillRect(x,$scope.canvasBarHeight-barHeight,barWidth,barHeight);
        x += barWidth;
        i+= 30;
      }
    }


  });
