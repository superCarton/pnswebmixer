'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EqualizerCtrl
 * @description
 * # EqualizerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .factory("equalizer", ['$http', "audioPlayer", function($http, audioPlayer) {
    var url = '../assets/loops.json';
    var obj = {
      getMyMixList : function(successCB, failCB) {
        $http.get(url)
          .success(function(data) {
            successCB(data);
          })
          .error(function(error){
            failCB(error);
          });
      },
      // Get all the parameter of this mix
      playMix : function(mix, successCB, failCB) {
        //TODO Get the json file of the mix
        var json;
        /*
        * json = {
        *   ["path" : "../assets/avenir.mp3", "frequency" : "50", "delay" : "1", ]
        * }
        * */
        var parameters;
        var start;
        var tracks = ["assets/loops/avenir.mp3","assets/loops/clap.mp3","assets/loops/double_bass1.mp3"];

        audioPlayer.initAudio(tracks, function(context, buffers) {
          var data = {
            "context" : context,
            "buffers" : buffers,
            "parameters" : parameters,
            "start" : start
          }
          audioPlayer.playMix(data, successCB, failCB);
        });
      }
    };
    return obj;
  }]);
