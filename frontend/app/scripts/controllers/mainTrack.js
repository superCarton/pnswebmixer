'use strict';

var CONVERSION_SECONDS_TO_PIXEL = 50; // 1 sec = 20px

/**
 * @ngdoc function
 * @name frontendApp.controller:MainTrackCtrl
 * @description
 * # MainTrackCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainTrackCtrl', function ($scope) {


    var tracks = [];
    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes

    // Master volume
    var masterVolumeNode;
    var trackVolumeNodes = [];

    var firstTime =true;

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


     // buildGraph(buffers);
      //playFrom(0);
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
      });

    }

    // Same as previous one except that we not rebuild the graph. Useful for jumping from one
// part of the song to another one, i.e. when we click the mouse on the sample graph
    function playFrom(startTime) {

      // Read current master volume slider position and set the volume
      //setMasterVolume();
      masterVolumeNode.gain.value = 1;

      samples.forEach(function (s) {
        // First parameter is the delay before playing the sample
        // second one is the offset in the song, in seconds, can be 2.3456
        // very high precision !
        s.start(0, startTime);
      });
      //buttonPlay.disabled = true;
      // buttonStop.disabled = false;
      // buttonPause.disabled = false;

      // Note : we memorise the current time, context.currentTime always
      // goes forward, it's a high precision timer
      console.log("start all tracks startTime =" + startTime);
    }
      //lastTime = context.currentTime;
       //paused = false;


      //maxWidth = $("#sample-board").width();
      //var maxWidth = 2000;
      //$("#mttimeline").css('max-width', maxWidth);
      //createTimeline();

      $scope.play = function(){
        if (!firstTime){
          stopAllTracks();
        } else {
          firstTime = false;
        }
        buildGraph(buffers);
        playFrom(0);
      };

    $scope.pause = function(){
      stopAllTracks();
    };

    $scope.stop = function(){
      stopAllTracks();
    };

    function stopAllTracks() {
      samples.forEach(function(s) {
        // destroy the nodes
        s.stop(0);
      });
    }

    $scope.number = 3;
    $scope.getNumber = function(num) {
      return new Array(num);
    };

    //  var timeline = $("#mttimeline");
      //$("#sample-board").scroll(function() {
        //timeline.prop("scrollLeft", this.scrollLeft);
      //});

    $scope.functionThatReturnsStyle = function(index) {
      var style = "position:absolute; left=" + index * (CONVERSION_SECONDS_TO_PIXEL * 5) + "px; bottom:0px; border-left: 1px solid black"
      return style;
    };

    $scope.getTimeForTimeline = function(sec){
      var minutes = Math.floor(sec / 60);
      if (minutes < 10)
        minutes = "0" + minutes;
      var seconds = sec - (minutes * 60);
      if (seconds < 10)
        seconds = "0" + seconds.toFixed(2);
      else
        seconds = seconds.toFixed(2);
      return minutes + ":" + seconds;
    };

    $scope.getSecondsFromTime = function (time){
      var aTime = time.split(':');
      var minute = parseInt(aTime[0]);
      var seconds = parseFloat(aTime[1]);
      return (minute * 60) + seconds;
    };


    $scope.drawSong = function(canvas, index){

      // Object that draws a sample waveform in a canvas
     /* var waveformDrawer = new WaveformDrawer();

      waveformDrawer.init(buffers[0], canvas, 'green');

      // First parameter = Y position (top left corner)
      // second = height of the sample drawing
      waveformDrawer.drawWave(0, canvas.height); */
    };



    $scope.addTrack = function(){



      $scope.apply();
    };

  });
