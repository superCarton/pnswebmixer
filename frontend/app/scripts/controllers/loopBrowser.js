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

    $http.get('../assets/loops.json')
      .then(function (res) {
        tracks = res.data;
        tracksToString = res.data;
      })
      .then(function () {
        loadAllSoundSamples();
        splitLoopsNames(tracksToString);
        $scope.loopList = tracksToString;
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
    var tracksToString;
    var buffers = [];
    var samples = [];
    var masterVolumeNode;
    var trackVolumeNodes = [];
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

    function splitLoopsNames(arr) {
      arr.forEach(function (part, index) {
        var tmp = arr[index].split("/")[2];
        arr[index] = tmp;
      });
    };
  });
