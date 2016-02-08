'use strict';

angular.module('frontendApp')
  .directive('equalizerDraw', function() {
    function link(scope, element, attrs) {
      scope.$watch('equalizerDraw', function(nVal) { element.val(nVal); });
      element.bind('blur', function() {
        var analyser = element.val();
        analyser.fftSize = 2048;
        var dataArray = new Uint8Array(analyser.frequencyBinCount);
        var canvasCtx =$('#equalizer-frequency').getContext("2d");
        canvasCtx.clearRect(0, 0, 400, 55);
        (function() {
          requestAnimationFrame(draw);
          analyser.getByteTimeDomainData(dataArray);
          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, 400, 155);
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(30, 30, 30)';

         canvasCtx.beginPath();
         var sliceWidth = 400 * 1.0 / analyser.frequencyBinCount;
          var x = 0;
          for(var i = 0; i < analyser.frequencyBinCount; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * 55;

            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          canvasCtx.lineTo(400, 55/2);
          canvasCtx.stroke();
        })();

       /* if( scope.equalizerDraw !== analyser ) {
          scope.$apply(function() {
            scope.equalizerDraw = analyser;
          });
        }*/
      });

    }
    return {
      restrict : 'A',
      link : link
    }
  });
