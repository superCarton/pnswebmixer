'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:SongSettingsCtrl
 * @description
 * # SongSettingsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('SongSettingsCtrl', ['$scope', function ($scope) {

    $scope.masterVolumeNode = '';
    $scope.filter = '';
    $scope.bufferList = '';
    $scope.trackVolumeNodes = [];
    $scope.tracks = ['../../assets/loops/kick.mp3', '../../assets/loops/snare.mp3'];
    $scope.volume = 1;
    $scope.init = function() {
      $scope.context = initAudioContext();
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

    $scope.playTrack = function() {
      buildGraph();
      playFrom();
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
        // Connect the master volume to the speakers
          $scope.filter.connect($scope.context.destination);
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
      })

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
      console.log("save");
    }

  }]);
