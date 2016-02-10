'use strict';

angular.module('frontendApp')
    .directive('myTest', function() {
        function link(scope, element, attrs) {
            var reglagePlay = angular.element(element.children()[0]);
            var reglagePause = angular.element(element.children()[1]);
            $(reglagePlay).on('click', function() {
                reglagePlay.css({'display' : 'none'});
                reglagePause.css({'display' : 'inline-block'});
            });
            $(reglagePause).on('click', function() {
                reglagePlay.css({'display' : 'inline-block'});
                reglagePause.css({'display' : 'none'});
            });


        }
        return {
            restrict : 'E',
            link : link
        }
    });
