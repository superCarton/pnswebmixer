'use strict';

/**
 * @ngdoc function
 * @description
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .factory("audioPlayer", ['$http', function($http) {
  var obj = {
    initAudio : function(tracks, callBack) {

      var context;
      //var analyser = context.createAnalyser();
      var buffers;

      (function init() {
         context = initAudioContext();
        loadAllSoundSamples();
      })();

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

      function loadAllSoundSamples() {
        //TODO Get all the tracks
        /*var tracks =[];
        parameters.forEach(function(track){
          tracks.push(track.path);
        });*/
        var bufferLoader = new BufferLoader(
          context,
          tracks,
          finishedLoading
        );
        bufferLoader.load();
      }

      function finishedLoading(bufferList) {
        buffers = bufferList;
        callBack(context, buffers);
      }

    },
    playMix : function(data, successCB, failCB) {
      //data contains context, buffers, start time and the parameters of each track
      var parameters = data.parameters;
      var buffers = data.buffers;
      var start = data.start;
      var context = data.context;
      var samples;
      (function() {
        buildGraph();
        playFrom();
        successCB(context.createAnalyser());
      })();
      function buildGraph() {
        var sources = [];
        // Create a single gain node for master volume
        buffers.forEach(function(sample, i) {
          var masterVolumeNode = context.createGain();
          var gainNode = context.createGain();
          var analyser = context.createAnalyser();
         /* $scope.gainNode.gain.value = $scope.song.gain;
          //$scope.filter = $scope.context.createBiquadFilter();
          $scope.delay = $scope.context.createDelay();
          $scope.delay.delayTime.value = $scope.song.delay;
          $scope.filter.frequency.value = 5000;
          $scope.filter.Q.value = 1;*/


          // each sound sample is the  source of a graph
          sources[i] = context.createBufferSource();
          sources[i].buffer = sample;
          var filter = context.createBiquadFilter();
          var delay = context.createDelay();
          // connect each sound sample to a vomume node
          var gainNode = context.createGain();
          // Connect the sound sample to its volume node
          sources[i].connect(gainNode);
          // Connects all track volume nodes a single master volume node
          //gainNode.connect(masterVolumeNode);
          gainNode.connect(filter);
          //Connect the master volume to the analyser
          filter.connect(analyser);
          //Connect the analyser to the delay
          analyser.connect(delay);
          // Connect the master volume to the speakers
          delay.connect(context.destination);
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
          successCB(context.createAnalyser());
        });
      }
    }
  };
    return obj;
  }]);
