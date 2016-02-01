'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AllcommentsCtrl
 * @description
 * # AllcommentsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('AllcommentsCtrl', ['$scope', '$rootScope','commentsFactory', function ($scope, $rootScope, commentsFactory) {

      $scope.commentaries = $rootScope.comments;
      $scope.commentId = $rootScope.currentCommentId;

      $scope.newcomment = "";

      $scope.comment = function(){

        var comm = $scope.newcomment;
        console.log("Comment from : " + $rootScope.user_id);
        console.log("Comment : " + comm);

        // add a comment
        commentsFactory.commentSample($scope.commentId, $rootScope.user_id, $rootScope.first_name, comm).then(function(data){
          // push comment in the list
        //  $scope.commentaries.push(data);
        });
      };

  }]);
