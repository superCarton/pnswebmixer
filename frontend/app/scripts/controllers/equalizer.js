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
    var samples;
    function buildGraph() {
      var sources = [];
      $scope.analyser = $scope.context.createAnalyser();
      // Create a single gain node for master volume
      $scope.buffers.forEach(function(sample, i) {
        var masterVolumeNode = $scope.context.createGain();
        var gainNode = $scope.context.createGain();

        /* $scope.gainNode.gain.value = $scope.song.gain;
         //$scope.filter = $scope.context.createBiquadFilter();
         $scope.delay = $scope.context.createDelay();
         $scope.delay.delayTime.value = $scope.song.delay;
         $scope.filter.frequency.value = 5000;
         $scope.filter.Q.value = 1;*/


        // each sound sample is the  source of a graph
        sources[i] = $scope.context.createBufferSource();
        sources[i].buffer = sample;
        var filter = $scope.context.createBiquadFilter();
        var delay = $scope.context.createDelay();
        // connect each sound sample to a vomume node
        var gainNode = $scope.context.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect( gainNode);
        // Connects all track volume nodes a single master volume node
        //gainNode.connect(masterVolumeNode);
        gainNode.connect(filter);
        //Connect the master volume to the analyser
        filter.connect($scope.analyser);
        //Connect the analyser to the delay
        $scope.analyser.connect(delay);
        // Connect the master volume to the speakers
        delay.connect($scope.context.destination);
        //$scope.filter.connect($scope.context.destination);
        // Connect source to filter, filter to destination.

        /*sources[i].connect($scope.filter);
         $scope.filter.connect($scope.context.destination);*/
        // On active les boutons start et stop
        samples = sources;
      })
    }

    function playFrom() {
      // Read current master volume slider position and set the volume
      samples.forEach(function(s) {
        // First parameter is the delay before playing the sample
        // second one is the offset in the song, in seconds, can be 2.3456
        // very high precision !
        s.start(0, 0);
      });
    }

    $scope.playMix = function(mix) {
      //TODO Get the mix by name
      equalizer.playMix(mix, function(context, buffers) {

        $scope.context = context;
        $scope.buffers = buffers;
        buildGraph();
        playFrom();
        initAnalyser();
        drawBar();
        draw();
      }, function(error) {
        console.log(error);
      });
    }



    function draw() {
      requestAnimationFrame(draw);
      $scope.analyser.getByteTimeDomainData($scope.dataArray);
      $scope.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      $scope.canvasCtx.fillRect(0, 0, $scope.canvasWidth,  $scope.canvasHeight);
      $scope.canvasCtx.lineWidth = 2;
      $scope.canvasCtx.strokeStyle = 'rgb(30, 30, 30)';

      $scope.canvasCtx.beginPath();
      $scope.sliceWidth = $scope.canvasWidth * 1.0 / $scope.analyser.frequencyBinCount;
      var x = 0;
      for(var i = 0; i < $scope.analyser.frequencyBinCount; i++) {

        var v = $scope.dataArray[i] / 128.0;
        var y = v * 55;

        if(i === 0) {
          $scope.canvasCtx.moveTo(x, y);
        } else {
          $scope.canvasCtx.lineTo(x, y);
        }
        x += $scope.sliceWidth;
      }
      $scope.canvasCtx.lineTo($scope.canvasWidth, 55/2);
      $scope.canvasCtx.stroke();
    }
    function drawBar() {
      requestAnimationFrame(drawBar);
      $scope.analyser.getByteFrequencyData($scope.dataArray);
      $scope.canvasBarCtx.fillStyle = 'rgb(0, 0, 0)';
      $scope.canvasBarCtx.fillRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
      var barWidth = ($scope.canvasBarWidth / $scope.analyser.frequencyBinCount) * 40;
      var barHeight;
      var x = 0;
      $scope.canvasBarLength = $scope.analyser.frequencyBinCount;
      $scope.canvasBarUnit = $scope.analyser.frequencyBinCount / 6;
      $scope.colors = ['#FF0000','#00FF0C', "#0000FF", "#EFF704", "#7189DE", "#00FFED", "#FF00D0"];
      for(var i = 0; i <  $scope.analyser.frequencyBinCount;) {
        barHeight = $scope.dataArray[i] / 2;
        $scope.canvasBarCtx.fillStyle = $scope.colors[Math.floor(i / $scope.canvasBarUnit)];
        $scope.canvasBarCtx.fillRect(x,$scope.canvasBarHeight-barHeight,barWidth,barHeight);
        x += barWidth;
        i+= 40;
      }
    }

    function initAnalyser() {
      $scope.analyser.fftSize = 2048;
      $scope.dataArray = new Uint8Array($scope.analyser.frequencyBinCount);
      $scope.canvas = document.getElementById("equalizer-realtime")
      $scope.canvasCtx = $scope.canvas.getContext("2d");
      $scope.canvasHeight = $scope.canvas.height;
      $scope.canvasWidth = $scope.canvas.width;
      $scope.canvasCtx.clearRect(0, 0,  $scope.canvasWidth,  $scope.canvasHeight);

      $scope.canvasBar = document.getElementById("equalizer-frequency");
      $scope.canvasBarCtx = $scope.canvasBar.getContext("2d");
      $scope.canvasBarHeight = $scope.canvasBarCtx.canvas.height;
      $scope.canvasBarWidth = $scope.canvasBar.width;
      $scope.canvasBarCtx.clearRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
    }

  }]);
