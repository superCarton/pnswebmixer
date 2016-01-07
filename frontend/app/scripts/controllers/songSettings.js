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
    $scope.bufferList = '';
    $scope.trackVolumeNodes = [];
    $scope.tracks = ['../../assets/loops/kick.mp3', '../../assets/loops/snare.mp3'];
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
        // Connect the master volume to the speakers
          $scope.masterVolumeNode.connect($scope.context.destination);
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

      $scope.samples.forEach(function(s) {
      // First parameter is the delay before playing the sample
      // second one is the offset in the song, in seconds, can be 2.3456
      // very high precision !
        s.start(0, 0);
      })

    }

  }]);
