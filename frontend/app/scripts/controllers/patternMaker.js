'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternMakerCtrl
 * @description
 * # PatternMakerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternMakerCtrl', function ($scope) {

    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes
    var masterVolumeNode;
    var trackVolumeNodes = [];

    var initAudioContext = function() {

      var audioContext = window.AudioContext || window.webkitAudioContext;

      var ctx = new audioContext();

      if(ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }

      return ctx;
    };

    var loadAllSoundSamples = function() {

      $("#play").attr("disabled", true);

      var bufferLoader;
      var tracks = $scope.tracks;

      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading
      );
      bufferLoader.load();
    };

    var finishedLoading = function (bufferList) {

      console.log("sounds finished loading");
      buffers = bufferList;

      $("#play").attr("disabled", false);
    };

    var buildGraph = function (bufferList){

      var sources = [];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      console.log("in build graph, bufferList.size = " + bufferList.length);

      bufferList.forEach(function(sample, i) {

        // create 8 samples for each sample
        sources[i] = [];
        for (var j=0; j<8; j++){

          // each sound sample is the  source of a graph
          sources[i][j] = context.createBufferSource();
          sources[i][j].buffer = sample;
          // connect each sound sample to a vomume node
          trackVolumeNodes[i] = context.createGain();
          // Connect the sound sample to its volume node
          sources[i][j].connect(trackVolumeNodes[i]);
          // Connects all track volume nodes a single master volume node
          trackVolumeNodes[i].connect(masterVolumeNode);
          // Connect the master volume to the speakers
          masterVolumeNode.connect(context.destination);
        }

      });

      samples = sources;
    };

    var stopAllTracks = function (){

      for (var i=0; i<samples.length; i++){
        for (var j=0; j<8; j++){
          // destroy the nodes
          samples[i][j].stop(0);
        }
      }

    };

    var playFrom = function(startTime) {

      masterVolumeNode.gain.value = 1;

      for (var i=0; i<samples.length; i++){
        for (var j=0; j<8; j++){
          // destroy the nodes
          samples[i][j].start(0, startTime);
        }
      }

      console.log("start all tracks startTime =" + startTime);
    };


    $scope.droppedObjects1 = [];
    var lightsIDs = ["#light-1", "#light-2", "#light-3", "#light-4", "#light-5", "#light-6", "#light-7", "#light-8"]
    $scope.tracks = [];

    $scope.onDropComplete1 = function (data) {

      var index = $scope.droppedObjects1.indexOf(data);
      if (index == -1) {
        $scope.droppedObjects1.push(data);
      }

      $scope.tracks = [];
      $scope.droppedObjects1.forEach(function (s) {
        $scope.tracks.push("assets/loops/" + s);
      });

      $scope.stopBeat();
      loadAllSoundSamples();

    };

    $scope.toggleButton = function (event) {

      var obj = event.currentTarget;
      angular.element(obj).toggleClass("fa-circle-thin");
      angular.element(obj).toggleClass("fa-circle");

      var index_song = parseInt(obj.getAttribute("data-song"));
      var index_bit = parseInt(obj.getAttribute("data-index"));

      console.log("index song " + index_song);
      console.log("index bit " + index_bit);
      console.log("was active " + obj.getAttribute("data-active"));

      if (obj.getAttribute("data-active") == "false"){ // non active
        obj.setAttribute("data-active", "true");
      } else { // active
        obj.setAttribute("data-active", "false");
      }

    };

    var i = 0;
    var stopPlaying = false;
    var timer;

    // 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
    // représente le nombre de blocks pour 1 temps
    var pulsation = 2;

    var metronome = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8751.mp3");
    var kick = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8692.mp3");
    var snare = new Audio("http://s1download-universal-soundbank.com/mp3/sounds/8717.mp3");

    var context = initAudioContext(); // Init audio context

    var animateLights = function () {

      if (i==0){
        stopAllTracks();
        buildGraph(buffers);
        playFrom(0);
      }

   /*   metronome.pause();
      metronome.currentTime = 0;
      kick.pause();
      kick.currentTime = 0;
      snare.pause();
      snare.currentTime = 0;

      metronome.play();

      if(i == 0 || i == 4) {
        kick.play();
      }

      if(i == 2 || i == 6) {
        snare.play();
      } */

      animateLight(i++);
      if (stopPlaying) {
        i = 0;
        return;
      } else if (i <= lightsIDs.length) {
        // 60000 = 1 minute en ms
        // divisé par la pulsation
        // multiplié par le tempo = delay entre chaque beat
        timer = setTimeout(animateLights, computeDelay(1));
      } else {
        i = 0;
        animateLights();
      }
    };

    var animateLight = function (index) {
      if (index == 0) {
        $(lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      } else {
        $(lightsIDs[index - 1]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
        $(lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      }

    };

    $scope.playBeat = function () {

      $("#play").attr("disabled", true);

      stopPlaying = false;
      timer = 0;
      i = 0;
      $("#play").toggleClass("playing")
      animateLights();
    };

    $scope.stopBeat = function () {
      $("#play").attr("disabled", false);

      stopAllTracks();

      metronome.pause();
      metronome.currentTime = 0;
      kick.pause();
      kick.currentTime = 0;
      snare.pause();
      snare.currentTime = 0
      if ($("#play").hasClass("playing")) {
        clearTimeout(timer);
        stopPlaying = true;
        $("#play").toggleClass("playing");
        lightsIDs.forEach(function (light) {
          if ($(light).hasClass("fa-circle")) {
            $(light).toggleClass("fa-circle").toggleClass("fa-circle-thin");
          }
        });
      }
    };

    function computeDelay(i) {
      return i * ((60000 / pulsation) / document.getElementById("myTempo").value);
    }

  });
