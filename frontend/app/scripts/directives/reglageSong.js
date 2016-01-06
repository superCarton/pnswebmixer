'use strict';

angular.module('frontendApp')
    .directive('myTest', function() {
        function link(scope, element, attrs) {
            var reglagePlay = angular.element(element.children()[0]);
            var reglagePause = angular.element(element.children()[1]);

            function setMasterVolume() {

                var fraction = parseInt(masterVolumeSlider.value) / parseInt(masterVolumeSlider.max);
                // Let's use an x*x curve (x-squared) since simple linear (x) does not
                // sound as good.
                if( masterVolumeNode != undefined)
                    masterVolumeNode.gain.value = fraction * fraction;
            }

            function playFrom() {
                setMasterVolume();
            }
            $(reglagePlay).on('click', function() {
                //playFrom();
                reglagePlay.css({'display' : 'none'});
                reglagePause.css({'display' : 'inline-block'});
            });
            $(reglagePause).on('click', function() {
                reglagePlay.css({'display' : 'inline-block'});
                reglagePause.css({'display' : 'none'});
            });
            $('.reglage-volume').on('click', function() {
                alert('hello');
            })

        }
        return {
            restrict : 'E',
            link : link
        }
    });