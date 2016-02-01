'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AllcommentsCtrl
 * @description
 * # AllcommentsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AllcommentsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

      $scope.commentaries = $rootScope.comments;
      $scope.commentId = $rootScope.currentCommentId;

  }]);
