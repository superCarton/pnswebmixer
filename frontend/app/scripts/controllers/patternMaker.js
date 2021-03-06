'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PatternMakerCtrl
 * @description
 * # PatternMakerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PatternMakerCtrl', function ($rootScope, $localStorage, $scope, $uibModal, PatternFactory, audioPlayer) {

    /******************* STORAGE ******************/
    $scope.$storage = $localStorage;
    setTimeout(scanElements, 10);
    setTimeout(loadAllSoundSamples, 10);

    $scope.$storage = $localStorage.$default({
      tracks: [],
      volumes: [],
      songSettings: [],
      tempo: 120,
      droppedObjects1: [],
      muteMatrix: [],
      soloMatrix: [],
      switchMatrix: [],
      playingLoops: []
    });

    $rootScope.resetStorage = function () {
      $localStorage.$reset({
        tracks: [],
        volumes: [],
        songSettings: [],
        tempo: 120,
        droppedObjects1: [],
        muteMatrix: [],
        soloMatrix: [],
        switchMatrix: [],
        playingLoops: []
      });
    };

    $scope.deleteAll = function () {
      if ($('#play').hasClass('playing')) {
        $scope.stopBeat();
      }
      if ($scope.$storage.tracks.length > 0) {
        $uibModal.open({
          templateUrl: 'views/deleteModal.html',
          controller: 'PatternMakerCtrl',
          backdrop: 'static'
        })
      } else {
        $uibModal.open({
          templateUrl: 'views/emptyDeleteModal.html',
          controller: 'PatternMakerCtrl',
          backdrop: 'static'
        })
      }
    }

    $scope.deleteAllYes = function () {
      $scope.resetStorage();
    }

    /****************      WEB AUDIO     ******************/

    var buffers = []; // audio buffers decoded
    var biquadFilter;

    function initAudioContext() {
      var ctx = audioPlayer.initAudio();
      biquadFilter = ctx.createBiquadFilter();
      $scope.setFrequency;
      return ctx;
    }

    function loadAllSoundSamples() {
      $("#play").attr("disabled", true);
      var bufferLoader;
      var tracks = $scope.$storage.tracks;
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

    /*********************    DRAG N DROP    **************************/

    $scope.onDropComplete1 = function (data) {

      // drag a loop
      if (typeof data === 'string') {

        $scope.$storage.droppedObjects1.push(data);
        $scope.$storage.switchMatrix.push(["false", "false", "false", "false", "false", "false", "false", "false",
          "false", "false", "false", "false", "false", "false", "false", "false"]);
        $scope.$storage.muteMatrix.push(false);
        $scope.$storage.soloMatrix.push(false);
        $scope.$storage.volumes.push(0.5);
        $scope.$storage.playingLoops.push([false, false, false, false, false, false, false, false, false, false, false,
          false, false, false, false, false]);
        $scope.$storage.tracks.push("assets/loops/" + data);
        $scope.$storage.songSettings.push({
          frequency:1000,
          gain:0.8,
          delay:0.5,
          active: false
        });

      } else {

        $rootScope.resetStorage();

        $scope.$storage.songSettings = data.song_settings.slice();
        $scope.$storage.droppedObjects1 = data.loops.slice();
        $scope.$storage.switchMatrix = data.beatmaking.slice();
        $scope.$storage.volumes = data.volumes_samples.slice();
        $scope.$storage.muteMatrix = data.mute_samples.slice();
        $scope.$storage.soloMatrix = data.solo_samples.slice();
        $scope.$storage.droppedObjects1.forEach(function (s) {
          $scope.$storage.tracks.push("assets/loops/" + s);
        });
        setTimeout(scanElements, 10);
      }
      $scope.stopBeat();
      loadAllSoundSamples();
    };

    function scanElements() {

      // Switch Matrix
      for (var i = 0; i < $scope.$storage.switchMatrix.length; i++) {
        for (var j = 0; j < $scope.$storage.switchMatrix[i].length; j++) {
          if ($scope.$storage.switchMatrix[i][j] == 'true') {
            $('#b' + i + j)["data-active"] = "true";
            $('#b' + i + j).addClass("fa-circle");
            $('#b' + i + j).removeClass("fa-circle-thin");
          } else {
            $('#b' + i + j)["data-active"] = "false";
            $('#b' + i + j).removeClass("fa-circle");
            $('#b' + i + j).addClass("fa-circle-thin");
          }
        }
      }

      // Mute Matrix
      if ($scope.$storage.soloMatrix.indexOf(true) == -1) {
        for (var i = 0; i < $scope.$storage.muteMatrix.length; i++) {
          if ($scope.$storage.muteMatrix[i]) {
            $("#mute-" + i).toggleClass("mute");
          }
        }
      }

      // Solo Matrix
      for (var i = 0; i < $scope.$storage.soloMatrix.length; i++) {
        if ($scope.$storage.soloMatrix[i]) {
          $("#solo-" + i).toggleClass("solo");
        }
      }

      // Volumes
      for (var i = 0; i < $scope.$storage.volumes.length; i++) {
        $("#vol-" + i).val($scope.$storage.volumes[i]);
      }
    }


    /***************************     ANIMATION LUMIERES     **********************************/

    $scope.lightsIDs = ["light-1", "light-2", "light-3", "light-4", "light-5", "light-6", "light-7", "light-8",
      "light-9", "light-10", "light-11", "light-12", "light-13", "light-14", "light-15", "light-16"];

    /******************* MUTE + SOLO + VOLUME *****************/

    $scope.toggleMute = function (index) {

      if ($scope.$storage.soloMatrix[index]) {
        $scope.$storage.muteMatrix[index] = false;
      } else {
        $scope.$storage.muteMatrix[index] = !$scope.$storage.muteMatrix[index];
      }
      $("#mute-" + index).toggleClass("mute");

      $scope.$storage.muteMatrix[index] ? $scope.$storage.volumes[index] = 0 : $scope.$storage.volumes[index] = parseFloat($("#vol-" + index).val());
      console.log($scope.$storage.volumes);
    };

    $scope.toggleSolo = function (index) {
      $scope.$storage.soloMatrix[index] = !$scope.$storage.soloMatrix[index];
      $("#solo-" + index).toggleClass("solo");

      if ($scope.$storage.soloMatrix.indexOf(true) != -1) {
        for (var i = 0; i < $scope.$storage.muteMatrix.length; i++) {
          $scope.$storage.soloMatrix[i] ? $scope.$storage.muteMatrix[i] = false : $scope.$storage.muteMatrix[i] = true
        }
      } else {
        for (var i = 0; i < $scope.$storage.muteMatrix.length; i++) {
          $("#mute-" + i).hasClass("mute") ? $scope.$storage.muteMatrix[i] = true : $scope.$storage.muteMatrix[i] = false
        }
      }

      for (var i = 0; i < $scope.$storage.muteMatrix.length; i++) {
        $scope.$storage.muteMatrix[i] ? $scope.$storage.volumes[i] = 0 : $scope.$storage.volumes[i] = parseFloat($("#vol-" + i).val())
      }

      console.log($scope.$storage.volumes);
    };

    $scope.changeVolume = function (index) {
      if (!$scope.$storage.muteMatrix[index]) {
        $scope.$storage.volumes[index] = parseFloat($("#vol-" + index).val());
      }
      console.log($scope.$storage.volumes);
    };

    /***************** DELETE TRACK ***********/
    $scope.deleteLoop = function (index) {
      $scope.stopBeat();
      $scope.$storage.droppedObjects1.splice(index, 1);
      $scope.$storage.tracks.splice(index, 1);
      $scope.$storage.songSettings.splice(index, 1);
      $scope.$storage.muteMatrix.splice(index, 1);
      $scope.$storage.soloMatrix.splice(index, 1);
      $scope.$storage.switchMatrix.splice(index, 1);
      $scope.$storage.volumes.splice(index, 1);
      scanElements();
      loadAllSoundSamples();
    };

    /************* BEATMAKING ****************/

    $scope.toggleButton = function (event) {
      var obj = event.currentTarget;

      angular.element(obj).toggleClass("fa-circle-thin");
      angular.element(obj).toggleClass("fa-circle");

      var index_song = parseInt(obj.getAttribute("data-song"));
      var index_bit = parseInt(obj.getAttribute("data-index"));

      if (obj.getAttribute("data-active") == "false") {
        obj.setAttribute("data-active", "true");
        $scope.$storage.switchMatrix[index_song][index_bit] = "true";
      } else {
        obj.setAttribute("data-active", "false");
        $scope.$storage.switchMatrix[index_song][index_bit] = "false";
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
            loops: $scope.$storage.droppedObjects1,
            beatmaking: $scope.$storage.switchMatrix,
            volumes_samples: $scope.$storage.volumes,
            mute_samples: $scope.$storage.muteMatrix,
            solo_samples: $scope.$storage.soloMatrix,
            song_settings: $scope.$storage.songSettings
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


    /************************** TEMPO ****************************/

// 1 = noire, 2 = croche, 4 = double croche, 8 = triple croche, 16 = quadruple croche
// représente le nombre de blocks pour 1 temps
    var pulsation = 4;

    /**
     * The delay for a note at a position on the pattern maker
     * @param i the position
     * @returns {number} the delay in sec
     */
    function computeDelay(i) {
      return i * ((60000 / pulsation) / $scope.$storage.tempo);
    }

    /********************** CHRIS WILSON OVERLAY ********************************/

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
    function playNote(buffer, sendGain, noteTime, index) {

      /********************** CREATING NODES *************************/

      // Create input node
      var voice = context.createBufferSource();

      // Create node for individual volumes
      var dryGainNode = context.createGain();

      // Create effects
      var filter = context.createBiquadFilter();
      var delay = context.createDelay();
      var feedback = context.createGain();

      // Create master volume node
      masterGainNode = context.createGain();

      /********************** GETTING VALUES *************************/

      voice.buffer = buffer;
      masterGainNode.gain.value = 1;

      // Get values for individual volumes
      $scope.$storage.muteMatrix[rhythmIndex] ? dryGainNode.gain.value = 0 : dryGainNode.gain.value = sendGain

      // Get effects values
      filter.frequency.value = $scope.$storage.songSettings[index].frequency;
      delay.delayTime.value = $scope.$storage.songSettings[index].delay;
      feedback.gain.value = $scope.$storage.songSettings[index].gain;

      /************************* CONNECTIONS ***************************/

      // Input connection
      voice.connect(dryGainNode);

      // Effect loop conection
      delay.connect(feedback);
      feedback.connect(filter);
      filter.connect(delay);

      // If the effect loop is on, we insert it into the chain
      if($scope.$storage.songSettings[index].active) {
        dryGainNode.connect(delay);
        delay.connect(masterGainNode);
      }

      // Individual volumes connection to Master Volume
      dryGainNode.connect(masterGainNode);

      // Master Volume connection to Analyzer
      masterGainNode.connect($rootScope.analyser);

      // Analyzer connection to main Output
      $rootScope.analyser.connect(context.destination);

      // PLAY SOUND
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
        for (var i = 0; i < $scope.$storage.tracks.length; i++) {

          // we have to schedule the song
          if ($scope.$storage.switchMatrix[i][rhythmIndex] == "true") {
            playNote(buffers[i], $scope.$storage.volumes[i], noteTime, i);
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
    };

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
    };

    /**
     * Callback for change tempo
     * Update the value of the tempo
     */
    $scope.changeTempo = function () {
      $scope.$storage.tempo = document.getElementById("myTempo").value;
    };


    /*********************** EFFECTS ***************************/

    $scope.openEffects = function (loopIndex) {

      $rootScope.loopEffectId = loopIndex;
      $rootScope.songSet = $scope.$storage.songSettings[loopIndex];

      $uibModal.open({
        templateUrl: 'views/songSettings.html',
        controller: 'SongSettingsCtrl',
        size: 'sm'
      });
    }

  });
