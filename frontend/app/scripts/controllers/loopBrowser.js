'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoopBrowserCtrl
 * @description
 * # LoopBrowserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoopBrowserCtrl', function ($scope, $http, $rootScope, PatternFactory, commentsFactory, $uibModal, $cookies) {

    /*********************** WEB AUDIO ******************************/

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
    }

    function stop(index) {
      samples[index].stop(0);
    }

    function splitLoopsNames(arr) {
      arr.forEach(function (part, index) {
        var tmp = arr[index].split("/")[2];
        arr[index] = tmp;
      });
    }


    /************************* GET PATTERNS **************************/

      // Get all users patterns
    $rootScope.getAllPatterns = function () {
      console.log("ALL PATTERNS");
      PatternFactory.loadAllPatterns().then(function (data) {
        $scope.patternsByUsers = data;
      }, function (err) {
        console.log(err);
      });
    };

    // Get only my patterns
    $rootScope.getMyPatterns = function () {
      console.log("MY PATTERNS");
      if ($cookies.get('user_id')) {
        PatternFactory.loadMyPatterns($cookies.get('user_id')).then(function (data) {
          $scope.myPatterns = data;
        }, function (err) {
          console.log(err);
        });
      }
    };

    $rootScope.clearAllPatterns = function () {
      console.log("CLEAR PATTERNS");
      $scope.myPatterns = [];
      $scope.patternsByUsers = [];
    };


    /******************** COMMENTS ON PATTERNS ***********************/

    $scope.dynamicPopover = {
      content: 'Hello, World!',
      templateUrl: 'commentTemplate.html',
      title: 'Ecrire un commentaire'
    };

    $scope.sendRate = function(id, mark){
      if ($rootScope.connected && mark != undefined) {

        var json = {
          user_id: $rootScope.user_id,
          pattern_id: id,
          mark: mark
        };
        PatternFactory.giveAMark(json).then(function (result) {
          $scope.patternsByUsers.forEach(function(pattern){
            if (pattern._id == result.value._id){
              pattern.global_mark = result.value.global_mark
            }
          });
        }, function (err) {
          console.log(err);
        })
      }
    };

    $scope.myRate = function (array){
      var ret = 0;
      array.forEach(function(json){
        if (json.user_id == $rootScope.user_id){
          console.log(json.mark);
          ret = json.mark;
        }
      });
      return ret;
    };

    // when there is a click on a comment button
    $scope.open = function (id, name) {

      if ($rootScope.connected) {

        // get the comment
        commentsFactory.allBySampleId(id).then(function (data) {

          $rootScope.comments = data;
          $rootScope.currentCommentId = id;
          $rootScope.currentPatternName = name;

          // open the modal
          $uibModal.open({
            templateUrl: 'views/comment.html',
            controller: 'AllcommentsCtrl',
            size: 'lg'
          });

        }, function (err) {
          console.log('error' + err);
        });

      } else {

        // open the modal
        $uibModal.open({
          templateUrl: 'views/not_connected_comment.html',
          controller: 'AllcommentsCtrl',
          size: 'lg'
        });

      }
    }
  });
