'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternMakerCtrl
 * @description
 * # PatternMakerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternMakerCtrl', function ($rootScope, $scope, PatternFactory) {

    /****************      WEB AUDIO     ******************/

    var buffers = []; // audio buffers decoded
    var samples = []; // audiograph nodes
    var masterVolumeNode;
    var trackVolumeNodes = [];
    $scope.tracks = [];
    var volumes = [];
    var tempo;

    function initAudioContext() {
      var audioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new audioContext();
      if (ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }
      return ctx;
    }

    function loadAllSoundSamples() {

      tempo = document.getElementById("myTempo").value;

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
      for (var i=0; i<buffers.length; i++){
        volumes[i] = $("#vol-" + i).val();
      }
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
          volumes[i] = $("#vol-" + i).val();

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
        false, false, false, false, false]);
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

     /* if (i == 0) {
        stopAllTracks();
        buildGraph(buffers);
        playFrom();
      } */

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

        volumes[i] = $("#vol-" + index).val();
        trackVolumeNodes[index].forEach(function (trackVolumeNode) {
          trackVolumeNode.gain.value = $("#vol-" + index).val();
        })
      }
    }

    /***************** DELETE TRACK ***********/
    $scope.deleteLoop = function (index) {
      $scope.stopBeat();
      $scope.droppedObjects1.splice(index, 1);
      $scope.tracks.splice(index, 1);
      muteMatrix.splice(index, 1);
      soloMatrix.splice(index, 1);
      switchMatrix.splice(index, 1);
      loadAllSoundSamples();
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

    /************ SAVE **********/

    $scope.pattern_title = '';
    var dialog;
    $rootScope.user_id = "vincent";

    $scope.save_pattern = function (name) {
      if (name != "") {
        if ($rootScope.user_id == "") {
          dialog = new BootstrapDialog({
            title: "Erreur",
            message: "Vous devez être connecté à votre compte pour pouvoir sauvegarder votre pattern !",
          });
          dialog.realize();
          //dialog.getModalHeader().css('background-color', '#f0b054');
          dialog.getModalHeader().css('background-color', '#d9534f');
          dialog.getModalHeader().css('color', '#ffffff');
          dialog.getModalHeader().css('border-top-left-radius', '6px');
          dialog.getModalHeader().css('border-top-right-radius', '6px');
          dialog.open();
        }

        else {

          var json_to_send = {
            name: name,
            user_id: $rootScope.user_id,
            loops: $scope.tracks,
            beatmaking: switchMatrix
          };

          PatternFactory.savePattern(json_to_send).then(function (data) {
            console.log(data);
            dialog = new BootstrapDialog({
              size: BootstrapDialog.SIZE_SMALL,
              title: "Sauvegarde réussie",
              message: "Votre pattern " + name.bold() + " a bien été enregistré !",
            });
            dialog.realize();
            dialog.getModalHeader().css('background-color', '#5cb85c');
            dialog.getModalHeader().css('color', '#ffffff');
            dialog.getModalHeader().css('border-top-left-radius', '6px');
            dialog.getModalHeader().css('border-top-right-radius', '6px');
            dialog.open();
          }, function (err) {
            console.log(err);
            dialog = new BootstrapDialog({
              size: BootstrapDialog.SIZE_SMALL,
              title: "Echec de la sauvegarde",
              message: "Votre pattern " + name.bold() + " n'a pas été enregistré...",
            });
            dialog.realize();
            //dialog.getModalHeader().css('background-color', '#f0b054');
            dialog.getModalHeader().css('background-color', '#d9534f');
            dialog.getModalHeader().css('color', '#ffffff');
            dialog.getModalHeader().css('border-top-left-radius', '6px');
            dialog.getModalHeader().css('border-top-right-radius', '6px');
            dialog.open();
          });
        }
      }
    }


    /******** PLAY BEAT + STOP BEAT **********/

    $scope.playBeat = function () {

      $("#play").attr("disabled", true);

      isPlaying = true;
      timer = 0;
      i = 0;

      $("#play").toggleClass("playing");

      handlePlay();
      animateLights();
    }

    $scope.stopBeat = function () {

      $("#play").attr("disabled", false);

     // stopAllTracks();
      handleStop();

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

    $scope.changeTempo = function(){

      tempo = document.getElementById("myTempo").value;
    }


    /******* TEMPO ********/

    // 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
    // représente le nombre de blocks pour 1 temps
    var pulsation = 4;

    function computeDelay(i) {
      return i * ((60000 / pulsation) / tempo);
    }

    /******* CHRIS WILSON OVERLAY ******/

    var context = initAudioContext(); // Init audio context
    var noteTime, startTime, timeoutId, rhythmIndex = 0;
    var OVERLAY = 0.200;
    var DELAY = 25;
    var LOOP_LENTGH = 16;
    var masterGainNode;

    function advanceNote() {

      noteTime += computeDelay(1)/1000;

      rhythmIndex++;
      if (rhythmIndex == LOOP_LENTGH) {
        rhythmIndex = 0;
      }

      console.log('advance note index ' + rhythmIndex + ' note time ' + noteTime);
    }

    function playNote(buffer, sendGain, noteTime) {

      // Create the note
      var voice = context.createBufferSource();
      voice.buffer = buffer;

      masterGainNode = context.createGain();
      masterGainNode.gain.value = 1;
      masterGainNode.connect(context.destination);

      // Connect to dry mix
      var dryGainNode = context.createGain();

      if (muteMatrix[i]) {
        dryGainNode.gain.value = 0;
      } else {
        dryGainNode.gain.value = sendGain;
      }
      voice.connect(dryGainNode);
      dryGainNode.connect(masterGainNode);

      voice.start(noteTime, 0);
    }

    function schedule() {

      var currentTime = context.currentTime;

      // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
      currentTime -= startTime;

      console.log('note time' + noteTime + '--' + currentTime);
     // console.log(noteTime + ' vs ' + currentTime + OVERLAY);

      while (noteTime < currentTime + OVERLAY) {

        // Convert noteTime to context time.
        var contextPlayTime = noteTime + currentTime;

        // iterate on notes at rhythm index
        for (var i=0; i<$scope.tracks.length; i++){

          // we have to schedule the song
          if (switchMatrix[i][rhythmIndex] == "true"){

            console.log('do play');
            playNote(buffers[i], volumes[i], noteTime);
          }
        }

        // Attempt to synchronize drawing time with sound
        /*  if (noteTime != lastDrawTime) {
         lastDrawTime = noteTime;
         drawPlayhead((rhythmIndex + 15) % 16);
         } */

        advanceNote();
      }

      timeoutId = setTimeout(schedule, DELAY);
    }

    function handlePlay() {

      noteTime = 0.0;
      startTime = context.currentTime;
      schedule();
    }

    function handleStop() {
      clearTimeout(timeoutId);
      rhythmIndex = 0;
    }

  });
