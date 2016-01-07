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

    var elapsedTimeSinceStart;

    // Create a second canvas
    var frontCanvas = document.createElement('canvas');
    frontCanvas.id = 'canvasFront';
    // Add it as a second child of the mainCanvas parent.
    canvas.parentNode.appendChild(frontCanvas);
    // make it same size as its brother
    frontCanvas.height = canvas.height;
    frontCanvas.width = canvas.width;
    var frontCtx = frontCanvas.getContext('2d');

    frontCanvas.addEventListener("mousedown", function(event) {
      console.log("mouse click on canvas, let's jump to another position in the song")
      var mousePos = getMousePos(frontCanvas, event);
      // will compute time from mouse pos and start playing from there...
      jumpTo(mousePos);
    });

    function jumpTo(mousePos) {
      console.log("in jumpTo x = " + mousePos.x + " y = " + mousePos.y);
      // width - totalTime
      // x - ?
      stopAllTracks();
      var totalTime = buffers[0].duration;
      var startTime = (mousePos.x * totalTime) / frontCanvas.width;
      elapsedTimeSinceStart = startTime;
      playAllTracks(startTime);
    }

  });
