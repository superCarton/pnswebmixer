'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AllcommentsCtrl
 * @description
 * # AllcommentsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AllcommentsCtrl', ['$scope', 'Commentary', '$routeParams', function ($scope, Commentary, $routeParams) {

    Commentary.allBySampleId($routeParams.link, function(result){
      $scope.commentaries = result;
    });

  }]);
