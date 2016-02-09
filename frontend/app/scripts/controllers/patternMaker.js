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
    var trackVolumeNodes = [];
    var biquadFilter;
    $scope.tracks = [];
    var volumes = [];
    var tempo;

    function initAudioContext() {
      var audioContext = window.AudioContext || window.webkitAudioContext;
      var ctx = new audioContext();
      if (ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
      }
      biquadFilter = ctx.createBiquadFilter();
      $scope.setFrequency;
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

      for (var i = 0; i < buffers.length; i++) {
        volumes[i] = $("#vol-" + i).val();
      }
      $("#play").attr("disabled", false);
    }

    /*********************    DRAG N DROP    **************************/

    $scope.droppedObjects1 = [];

    $scope.onDropComplete1 = function (data) {
      console.log(data);
      var index = $scope.droppedObjects1.indexOf(data);
      if (typeof data === 'string') {
        $scope.droppedObjects1.push(data);
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
      } else {
        $scope.droppedObjects1 = [];
        $scope.tracks = [];
        $scope.droppedObjects1 = data.loops;
        switchMatrix = data.beatmaking;
        volumes = data.volumes_samples;
        muteMatrix = data.mute_samples;
        soloMatrix = data.solo_samples;
        $scope.droppedObjects1.forEach(function (s) {
          $scope.tracks.push("assets/loops/" + s);
        });
        setTimeout(scanElements, 10);
      }
      $scope.stopBeat();
      loadAllSoundSamples();
    }

    function scanElements() {
      // Switch Matrix
      for (var i = 0; i < switchMatrix.length; i++) {
        for (var j = 0; j < switchMatrix[i].length; j++) {
          if (switchMatrix[i][j] == 'true') {
            $('#b' + i + j)["data-active"] = "true";
            $('#b' + i + j).toggleClass("fa-circle");
            $('#b' + i + j).toggleClass("fa-circle-thin");
          }
        }
      }

      // Mute Matrix
      for (var i = 0; i < muteMatrix.length; i++) {
        if (muteMatrix[i]) {
          $("#mute-" + i).toggleClass("mute");
        }
      }

      // Solo Matrix
      for (var i = 0; i < soloMatrix.length; i++) {
        if (soloMatrix[i]) {
          $("#solo-" + i).toggleClass("solo");
        }
      }
    }


    /***************************     ANIMATION LUMIERES     **********************************/

    $scope.lightsIDs = ["light-1", "light-2", "light-3", "light-4", "light-5", "light-6", "light-7", "light-8",
      "light-9", "light-10", "light-11", "light-12", "light-13", "light-14", "light-15", "light-16"];

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

      muteMatrix[index] ? volumes[index] = 0 : volumes[index] = $("#vol-" + index).val();

    };

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

      for (var i = 0; i < muteMatrix.length; i++) {
        muteMatrix[i] ? volumes[i] = 0 : volumes[i] = $("#vol-" + i).val()
      }
    };

    $scope.changeVolume = function (index) {
      if (!muteMatrix[index]) {
        volumes[index] = $("#vol-" + index).val();
      }
    };

    /***************** DELETE TRACK ***********/
    $scope.deleteLoop = function (index) {
      $scope.stopBeat();
      $scope.droppedObjects1.splice(index, 1);
      $scope.tracks.splice(index, 1);
      muteMatrix.splice(index, 1);
      soloMatrix.splice(index, 1);
      switchMatrix.splice(index, 1);
      loadAllSoundSamples();
    };

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
    };

    /************ SAVE **********/

    $scope.pattern_title = '';
    var dialog;

    $scope.save_pattern = function (name) {
      if (name != '') {
        if ($rootScope.user_id == '') {

          // ERREUR SI PAS CONNECTE
          dialog = new BootstrapDialog({
            title: "Erreur",
            message: "Vous devez être connecté à votre compte pour pouvoir sauvegarder votre pattern !",
          });
          dialog.realize();
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
            loops: $scope.droppedObjects1,
            beatmaking: switchMatrix,
            volumes_samples: volumes,
            mute_samples: muteMatrix,
            solo_samples: soloMatrix
          };

          PatternFactory.savePattern(json_to_send).then(function (data) {

            // SAUVEGARDE REUSSIE

            // On affiche une modal
            dialog = new BootstrapDialog({
              title: "Sauvegarde réussie",
              message: "Votre pattern " + name.bold() + " a bien été enregistré !",
            });
            dialog.realize();
            dialog.getModalHeader().css('background-color', '#5cb85c');
            dialog.getModalHeader().css('color', '#ffffff');
            dialog.getModalHeader().css('border-top-left-radius', '6px');
            dialog.getModalHeader().css('border-top-right-radius', '6px');
            dialog.open();

            // On get tous les patterns pour faire apparaitre le nouveau
            $rootScope.getAllPatterns();
            $rootScope.getMyPatterns();

          }, function (err) {

            // SAUVEGARDE ECHOUEE

            // On affiche une modal
            dialog = new BootstrapDialog({
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
    };


    /******* TEMPO ********/

// 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
// représente le nombre de blocks pour 1 temps
    var pulsation = 4;

    /**
     * The delay for a note at a position on the pattern maker
     * @param i the position
     * @returns {number} the delay in sec
     */
    function computeDelay(i) {
      return i * ((60000 / pulsation) / tempo);
    }

    /******* CHRIS WILSON OVERLAY ******/

    var context = initAudioContext(); // Init audio context
    var noteTime, startTime, timeoutId, rhythmIndex = 0;
    var OVERLAY = 0.100;
    var DELAY = 25;
    var LOOP_LENTGH = 16;
    var masterGainNode;

    /**
     * Change current note
     */
    function advanceNote() {

      noteTime += computeDelay(1) / 1000;

      rhythmIndex++;

      // set light on at the correct index
      animateLight(rhythmIndex - 1);

      if (rhythmIndex == LOOP_LENTGH) {

        // reset light at the end of the boucle
        animateLight(LOOP_LENTGH);
        rhythmIndex = 0;
      }

    }

    /**
     * Build and play a song with a delay
     * @param buffer the song buffer
     * @param sendGain the gain
     * @param noteTime the delay to play the song
     */
    function playNote(buffer, sendGain, noteTime) {

      // Create the note
      var voice = context.createBufferSource();
      voice.buffer = buffer;

      masterGainNode = context.createGain();
      masterGainNode.gain.value = 1;
      masterGainNode.connect(context.destination);

      // Connect to dry mix
      var dryGainNode = context.createGain();

      if (muteMatrix[rhythmIndex]) {
        dryGainNode.gain.value = 0;
      } else {
        dryGainNode.gain.value = sendGain;
      }
      voice.connect(dryGainNode);
      dryGainNode.connect(masterGainNode);

      voice.start(noteTime, 0);
    }

    /**
     * Main schedulling function
     * Called each DELAY ms
     * Look ahead for OVERLAY ms to play songs
     */
    function schedule() {

      var currentTime = context.currentTime;

      // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
      currentTime -= startTime;

      while (noteTime < currentTime + OVERLAY) {

        // Convert noteTime to context time.
        var contextPlayTime = noteTime + currentTime;

        // iterate on notes at rhythm index
        for (var i = 0; i < $scope.tracks.length; i++) {

          // we have to schedule the song
          if (switchMatrix[i][rhythmIndex] == "true") {
            playNote(buffers[i], volumes[i], noteTime);
          }
        }

        advanceNote();
      }

      timeoutId = setTimeout(schedule, DELAY);
    }

    /**
     * Switch on light at index
     * Switch of others
     * @param index
     */
    function animateLight(index) {
      if (index == 0) {
        $('#' + $scope.lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      } else {
        $('#' + $scope.lightsIDs[index - 1]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
        $('#' + $scope.lightsIDs[index]).toggleClass("fa-circle-thin").toggleClass("fa-circle");
      }
    }

    /**
     * Play songs
     */
    function handlePlay() {
      noteTime = 0.0;
      startTime = context.currentTime;
      schedule();
    }

    /**
     * Stop schedulling function
     */
    function handleStop() {
      clearTimeout(timeoutId);
      rhythmIndex = 0;
    }

    /**
     * Callback for play button
     * Play the beats
     */
    $scope.playBeat = function () {

      // disable play button
      $("#play").attr("disabled", true);
      $("#play").toggleClass("playing");

      handlePlay();
    }

    /**
     * Callback for stop button
     * Stops the music and the lights
     */
    $scope.stopBeat = function () {

      $("#play").attr("disabled", false);

      handleStop();

      if ($("#play").hasClass("playing")) {
        $("#play").toggleClass("playing");
        $scope.lightsIDs.forEach(function (light) {
          if ($('#' + light).hasClass("fa-circle")) {
            $('#' + light).toggleClass("fa-circle").toggleClass("fa-circle-thin");
          }
        });
      }
    }

    /**
     * Callback for change tempo
     * Update the value of the tempo
     */
    $scope.changeTempo = function () {
      tempo = document.getElementById("myTempo").value;
    };

    /****** Frequency ********/
    $scope.setFrequency = function () {
      var minValue = 40;
      var maxValue = context.sampleRate / 2;
      var unitRate = (maxValue - minValue) / 100;
      var currentRate = unitRate * $scope.song.frequency + minValue;
      if (biquadFilter.frequency != undefined) {
        biquadFilter.frequency.value = currentRate;
      }
    }

  })
;
