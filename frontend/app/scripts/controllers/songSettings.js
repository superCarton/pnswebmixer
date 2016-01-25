'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SongSettingsCtrl
 * @description
 * # SongSettingsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SongSettingsCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.masterVolumeNode = '';
    $scope.filter = '';
    $scope.bufferList = '';
    $scope.trackVolumeNodes = [];
    $scope.tracks = ['../../assets/loops/avenir.mp3'];
    $scope.volume = 1;
    $scope.init = function() {
      $scope.context = initAudioContext();
      $scope.analyser = $scope.context.createAnalyser();
      initAnalyser();
      loadAllSoundSamples();

    }

    function initAudioContext() {
      // Initialise the Audio Context
      // There can be only one!
      var audioContext = window.AudioContext || window.webkitAudioContext;

      var ctx = new audioContext();

      if(ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }

      return ctx;
    }
    function initAnalyser() {
      $scope.analyser.fftSize = 2048;
      $scope.dataArray = new Uint8Array($scope.analyser.frequencyBinCount);
      $scope.canvasCtx =document.getElementById("song-visualize").getContext("2d");
      $scope.canvasCtx.clearRect(0, 0, 400, 55);



      $scope.canvasBar = document.getElementById("song-visualize-bar");
      $scope.canvasBarCtx = $scope.canvasBar.getContext("2d");
      $scope.canvasBarHeight = $scope.canvasBar.height;
      $scope.canvasBarWidth = $scope.canvasBar.width;
      $scope.canvasBarCtx.clearRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
    }

    $scope.playTrack = function() {
      buildGraph();
      playFrom();
    }
    function draw() {
     requestAnimationFrame(draw);
      $scope.analyser.getByteTimeDomainData($scope.dataArray);
      $scope.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      $scope.canvasCtx.fillRect(0, 0, 400, 155);
      $scope.canvasCtx.lineWidth = 2;
      $scope.canvasCtx.strokeStyle = 'rgb(30, 30, 30)';

      $scope.canvasCtx.beginPath();
      $scope.sliceWidth = 400 * 1.0 / $scope.analyser.frequencyBinCount;
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
      $scope.canvasCtx.lineTo(400, 55/2);
      $scope.canvasCtx.stroke();
    }
    function drawBar() {

      requestAnimationFrame(drawBar);
      $scope.analyser.getByteTimeDomainData($scope.dataArray);
      $scope.canvasBarCtx.fillStyle = 'rgb(0, 0, 0)';
      $scope.canvasBarCtx.fillRect(0, 0, $scope.canvasBarWidth, $scope.canvasBarHeight);
      var barWidth = ($scope.canvasBarWidth / $scope.analyser.frequencyBinCount);
      var barHeight;
      var x = 0;
      $scope.canvasBarLength = $scope.analyser.frequencyBinCount;
      $scope.canvasBarUnit = $scope.analyser.frequencyBinCount / 6;
      $scope.colors = ['#FF0000','#00FF0C', "#0000FF", "#EFF704", "#7189DE", "#00FFED", "#FF00D0"];
      for(var i = 0; i <  $scope.analyser.frequencyBinCount; i++) {
        barHeight = $scope.dataArray[i] / 2;
        $scope.canvasBarCtx.fillStyle = $scope.colors[Math.floor(i / $scope.canvasBarUnit)];
        $scope.canvasBarCtx.fillRect(x,$scope.canvasBarHeight-barHeight,barWidth,barHeight);
        x += barWidth;
      }

    }
    function buildGraph() {
        var sources = [];
        // Create a single gain node for master volume
        $scope.masterVolumeNode = $scope.context.createGain();
        $scope.filter = $scope.context.createBiquadFilter();
        $scope.filter.frequency.value = 5000;
        $scope.filter.Q.value = 1;
        $scope.buffers.forEach(function(sample, i) {
        // each sound sample is the  source of a graph
        sources[i] = $scope.context.createBufferSource();
        sources[i].buffer = sample;
        // connect each sound sample to a vomume node
        $scope.trackVolumeNodes[i] = $scope.context.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect( $scope.trackVolumeNodes[i]);
        // Connects all track volume nodes a single master volume node
          $scope.trackVolumeNodes[i].connect($scope.masterVolumeNode);
          $scope.masterVolumeNode.connect($scope.filter);
          //Connect the master volume to the analyser
          $scope.filter.connect($scope.analyser);
        // Connect the master volume to the speakers
          $scope.analyser.connect($scope.context.destination);
          //$scope.filter.connect($scope.context.destination);
          // Connect source to filter, filter to destination.

          /*sources[i].connect($scope.filter);
          $scope.filter.connect($scope.context.destination);*/
        // On active les boutons start et stop
        $scope.samples = sources;
      })
    }


    function loadAllSoundSamples() {
      $scope.bufferLoader = new BufferLoader(
        $scope.context,
        $scope.tracks,
        finishedLoading
      );
      $scope.bufferLoader.load();
    }

    function finishedLoading(bufferList) {
      $scope.buffers = bufferList;
    }

    function playFrom() {
      // Read current master volume slider position and set the volume
      $scope.setMasterVolume();
      $scope.setFrequency();
      $scope.setFrequencyType();
      $scope.setQuality();
      $scope.samples.forEach(function(s) {
      // First parameter is the delay before playing the sample
      // second one is the offset in the song, in seconds, can be 2.3456
      // very high precision !
        s.start(0, 0);

      });
      draw();
      drawBar();
    }


    $scope.changeVolume = function() {
      $scope.volume = $scope.song.volume / 100;
      $scope.setMasterVolume();
    }
    $scope.setFrequency = function() {
      var minValue = 40;
      var maxValue = $scope.context.sampleRate / 2;
      var unitRate = (maxValue - minValue) / 100;
      var currentRate = unitRate *  $scope.song.frequency + minValue;
      if( $scope.filter.frequency != undefined) {
        $scope.filter.frequency.value = currentRate;
      }
    }
    $scope.setFrequencyType = function() {
      if( $scope.filter.frequency != undefined) {
        $scope.filter.frequency.type = $scope.frequency.type;
      }
    }
    $scope.setQuality = function() {
      if( $scope.filter.Q != undefined) {
        $scope.filter.Q.value = $scope.song.quality;
      }
    }
    $scope.setMasterVolume = function () {
      if( $scope.masterVolumeNode.gain != undefined) {
        $scope.masterVolumeNode.gain.value = $scope.volume * $scope.volume;
      }
    }
    $scope.save = function() {
      var formdata = new FormData();
      formdata.append('name', 'test-test');
      formdata.append('file', file);
      $http({
        method: 'POST',
        url: 'http://localhost:4000/samples/upload',
        data: formdata
      }).success(function(data) {
          console.log(data);
        })
        .error(function(err) {
          console.log(err);
        });
    }


  }]);
