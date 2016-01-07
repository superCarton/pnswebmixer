'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainTrackCtrl
 * @description
 * # MainTrackCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainTrackCtrl', function () {

    var tracks = [];
    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes

    // Master volume
    var masterVolumeNode;
    var trackVolumeNodes = [];


    // Init audio context
    var context = initAudioContext();

    loadAllSoundSamples();

    var bufferLoader;
    function loadAllSoundSamples() {

      tracks = ["assets/loops/snare.mp3"];

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


      buildGraph(buffers);
      playFrom(0);
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

    function buildGraph(bufferList) {
      var sources = [];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      console.log("in build graph, bufferList.size = " + bufferList.length);

      bufferList.forEach(function(sample, i) {

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

    // Same as previous one except that we not rebuild the graph. Useful for jumping from one
// part of the song to another one, i.e. when we click the mouse on the sample graph
    function playFrom(startTime) {

      // Read current master volume slider position and set the volume
      //setMasterVolume();
      masterVolumeNode.gain.value = 100;

      samples.forEach(function(s) {
        // First parameter is the delay before playing the sample
        // second one is the offset in the song, in seconds, can be 2.3456
        // very high precision !
        s.start(0, startTime);
      });
      /*buttonPlay.disabled = true;
       buttonStop.disabled = false;
       buttonPause.disabled = false;*/

      // Note : we memorise the current time, context.currentTime always
      // goes forward, it's a high precision timer
      console.log("start all tracks startTime =" + startTime);
      /*lastTime = context.currentTime;
       paused = false;*/
    };

  });
