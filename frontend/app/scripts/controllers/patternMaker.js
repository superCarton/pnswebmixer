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

    /****************      WEB AUDIO     ******************/

    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes
    var masterVolumeNode;
    var trackVolumeNodes = [];
    $scope.tracks = [];

    function initAudioContext() {
      var audioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new audioContext();
      if (ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }
      return ctx;
    }

    function loadAllSoundSamples() {
      $("#play").attr("disabled", true);
      var bufferLoader;
      var tracks = $scope.tracks;
      bufferLoader = new BufferLoader(
        context,
        tracks,
        finishedLoading
      );
      bufferLoader.load();
    }

    function finishedLoading(bufferList) {
      console.log("sounds finished loading");
      buffers = bufferList;
      $("#play").attr("disabled", false);
    }

    function buildGraph(bufferList) {
      var sources = [];
      // Create a single gain node for master volume
      masterVolumeNode = context.createGain();
      //console.log("in build graph, bufferList.size = " + bufferList.length);
      bufferList.forEach(function (sample, i) {
        // create 8 samples for each sample
        sources[i] = [];
        trackVolumeNodes[i] = [];
        for (var j = 0; j < 16; j++) {
          // each sound sample is the  source of a graph
          sources[i][j] = context.createBufferSource();
          sources[i][j].buffer = sample;
          // connect each sound sample to a vomume node
          trackVolumeNodes[i][j] = context.createGain();
          // Connect the sound sample to its volume node
          sources[i][j].connect(trackVolumeNodes[i][j]);
          // Connects all track volume nodes a single master volume node
          trackVolumeNodes[i][j].connect(masterVolumeNode);
          // Connect the master volume to the speakers
          masterVolumeNode.connect(context.destination);

          trackVolumeNodes[i][j].gain.value = $("#vol-" + i).val();

          // Checking for mute loop
          if (muteMatrix[i]) {
            trackVolumeNodes[i][j].gain.value = 0;
          }

        }
      });
      samples = sources;
    }

    function stopAllTracks() {
      for (var i = 0; i < samples.length; i++) {
        for (var j = 0; j < 16; j++) {
          // destroy the nodes
          if (playingLoops[i][j]) {
            samples[i][j].stop(0);
            playingLoops[i][j] = false;
          }
        }
      }
    }

    function playFrom() {
      masterVolumeNode.gain.value = 1;
      for (var i = 0; i < samples.length; i++) {
        for (var j = 0; j < 16; j++) {
          if (switchMatrix[i][j] == "true") {
            samples[i][j].start(context.currentTime + (computeDelay(j) / 1000), 0);
            playingLoops[i][j] = true;
          }
        }
      }
    }

    var context = initAudioContext(); // Init audio context


    /*********************    DRAG N DROP    **************************/

    $scope.droppedObjects1 = [];

    $scope.onDropComplete1 = function (data) {
      var index = $scope.droppedObjects1.indexOf(data);
      if (index == -1) {
        $scope.droppedObjects1.push(data);
      }
      $scope.tracks = [];
      switchMatrix.push(["false", "false", "false", "false", "false", "false", "false", "false",
        "false", "false", "false", "false", "false", "false", "false", "false"]);
      muteMatrix.push(false);
      soloMatrix.push(false);
      playingLoops.push([false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false,]);
      $scope.droppedObjects1.forEach(function (s) {
        $scope.tracks.push("assets/loops/" + s);
      });
      $scope.stopBeat();
      loadAllSoundSamples();
    }


    /***************************     ANIMATION LUMIERES     **********************************/

    $scope.lightsIDs = ["light-1", "light-2", "light-3", "light-4", "light-5", "light-6", "light-7", "light-8",
      "light-9", "light-10", "light-11", "light-12", "light-13", "light-14", "light-15", "light-16"];

    var i = 0;
    var isPlaying = false;
    var timer;

    function animateLights() {
      if (i == 0) {
        stopAllTracks();
        buildGraph(buffers);
        playFrom();
      }

      animateLight(i++);

      if (!isPlaying) {
        i = 0;
        return;
      } else if (i <= $scope.lightsIDs.length) {
        timer = setTimeout(animateLights, computeDelay(1));
      } else {
        i = 0;
        animateLights();
      }
    }

    function animateLight(index) {
      if (index == 0) {
        $('#' + $scope.lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      } else {
        $('#' + $scope.lightsIDs[index - 1]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
        $('#' + $scope.lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      }
    }

    /******************* MUTE + SOLO + VOLUME *****************/

    var muteMatrix = [];
    var soloMatrix = [];

    $scope.toggleMute = function (index) {
      if (soloMatrix[index]) {
        muteMatrix[index] = false;
      } else {
        muteMatrix[index] = !muteMatrix[index];
      }
      $("#mute-" + index).toggleClass("mute");

      if (isPlaying) {
        trackVolumeNodes[index].forEach(function (trackVolumeNode) {
          muteMatrix[index] ? trackVolumeNode.gain.value = 0 : trackVolumeNode.gain.value = $("#vol-" + index).val()
        })
      }

    }

    $scope.toggleSolo = function (index) {
      soloMatrix[index] = !soloMatrix[index];
      $("#solo-" + index).toggleClass("solo");

      if (soloMatrix.indexOf(true) != -1) {
        for (var i = 0; i < muteMatrix.length; i++) {
          soloMatrix[i] ? muteMatrix[i] = false : muteMatrix[i] = true
        }
      } else {
        for (var i = 0; i < muteMatrix.length; i++) {
          $("#mute-" + i).hasClass("mute") ? muteMatrix[i] = true : muteMatrix[i] = false
        }
      }

      if (isPlaying) {
        for (var i = 0; i < muteMatrix.length; i++) {
          trackVolumeNodes[i].forEach(function (trackVolumeNode) {
            muteMatrix[i] ? trackVolumeNode.gain.value = 0 : trackVolumeNode.gain.value = $("#vol-" + i).val()
          })
        }
      }
    }

    $scope.changeVolume = function (index) {
      if (isPlaying && !muteMatrix[index]) {
        trackVolumeNodes[index].forEach(function (trackVolumeNode) {
          trackVolumeNode.gain.value = $("#vol-" + index).val();
        })
      }
    }

    /************* BEATMAKING ****************/

    var switchMatrix = [];
    var playingLoops = [];

    $scope.toggleButton = function (event) {
      var obj = event.currentTarget;

      angular.element(obj).toggleClass("fa-circle-thin");
      angular.element(obj).toggleClass("fa-circle");

      var index_song = parseInt(obj.getAttribute("data-song"));
      var index_bit = parseInt(obj.getAttribute("data-index"));

      if (obj.getAttribute("data-active") == "false") {
        obj.setAttribute("data-active", "true");
        switchMatrix[index_song][index_bit] = "true";
      } else {
        obj.setAttribute("data-active", "false");
        switchMatrix[index_song][index_bit] = "false";
      }
    }


    /******** PLAY BEAT + STOP BEAT **********/

    $scope.playBeat = function () {
      $("#play").attr("disabled", true);

      isPlaying = true;
      timer = 0;
      i = 0;

      $("#play").toggleClass("playing");

      animateLights();
    }

    $scope.stopBeat = function () {
      $("#play").attr("disabled", false);

      stopAllTracks();

      if ($("#play").hasClass("playing")) {
        clearTimeout(timer);
        isPlaying = false;
        $("#play").toggleClass("playing");
        $scope.lightsIDs.forEach(function (light) {
          if ($('#' + light).hasClass("fa-circle")) {
            $('#' + light).toggleClass("fa-circle").toggleClass("fa-circle-thin");
          }
        });
      }
    }


    /******* TEMPO ********/

    // 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
    // représente le nombre de blocks pour 1 temps
    var pulsation = 4;

    function computeDelay(i) {
      return i * ((60000 / pulsation) / document.getElementById("myTempo").value);
    }

  });
