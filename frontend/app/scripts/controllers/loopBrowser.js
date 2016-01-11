'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoopBrowserCtrl
 * @description
 * # LoopBrowserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoopBrowserCtrl', function ($scope, $http) {
    $scope.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

    window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;

      if (key == 68) {
        $scope.playSample(1);
      }else if (key == 75) {
        $scope.playSample(2);
      }
    }

    $http.get('../assets/loops.json')
      .then(function (res) {
        $scope.loopList = res.data;
      })
      .then(function () {
        tracks = $scope.loopList;
        loadAllSoundSamples();
      });

    $scope.playSample = function ($index) {
      if (lastPlayed == $index) {
        stop($index);
      } else {
        lastPlayed = $index;
      }
      buildGraph(buffers);
      playFrom($index, 0);
    };

    var lastPlayed;

    var tracks;
    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes

    // Master volume
    var masterVolumeNode;
    var trackVolumeNodes = [];


    // Init audio context
    var context = initAudioContext();

    var bufferLoader;

    function loadAllSoundSamples() {

      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading
      );
      bufferLoader.load();
    }

    function finishedLoading(bufferList) {
      console.log("finished loading");
      buffers = bufferList;
    }

    function initAudioContext() {
      // Initialise the Audio Context
      // There can be only one!
      var audioContext = window.AudioContext || window.webkitAudioContext;

      var ctx = new audioContext();

      if (ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }

      return ctx;
    }


    function buildGraph(bufferList) {
      var sources = [];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      console.log("in build graph, bufferList.size = " + bufferList.length);

      bufferList.forEach(function (sample, i) {

        // each sound sample is the  source of a graph
        sources[i] = context.createBufferSource();
        sources[i].buffer = sample;
        // connect each sound sample to a vomume node
        trackVolumeNodes[i] = context.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect(trackVolumeNodes[i]);
        // Connects all track volume nodes a single master volume node
        trackVolumeNodes[i].connect(masterVolumeNode);
        // Connect the master volume to the speakers
        masterVolumeNode.connect(context.destination);
        // On active les boutons start et stop
        samples = sources;
      })
    }

    function playFrom(index, startTime) {
      masterVolumeNode.gain.value = 1;
      samples[index].start(0, startTime);
    };

    function stop(index) {
      samples[index].stop(0);
    };

  });
