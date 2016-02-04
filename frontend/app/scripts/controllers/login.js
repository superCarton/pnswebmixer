'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', ['$rootScope', '$scope', 'user', function ($scope, $rootScope, user) {

    $scope.init = function() {
      $scope.logout = false;
      $scope.login  = true;
      $scope.register =  true;
      $scope.loginForm = false;
      $scope.loginButton = false;
      $scope.username = false;
    };

    $scope.showSignUp = function() {
      $("#lastNameLogin").required = true;
      $("#firstNameLogin").required = true;
      $scope.loginForm = true;
      $scope.loginButton = false;
      $scope.registerButton = true;
      $scope.showLastName = true;
      $scope.showFirstName = true;
      $scope.email = '';
      $scope.pwd = '';
      $scope.firstName = '';
      $scope.lastName = '';
    };

    $scope.showLogin = function() {
      $("#lastNameLogin").required = false;
      $("#firstNameLogin").required = false;
      $scope.loginForm = true;
      $scope.loginButton = true;
      $scope.registerButton = false;
      $scope.showFirstName = false;
      $scope.showLastName =false;
      $scope.email = '';
      $scope.pwd = '';
    };



    $scope.signUp = function() {
       $scope.signUpContent = {
        "first_name" : $scope.firstName,
        "last_name" : $scope.lastName,
        "email" : $scope.email,
        "password" : $scope.pwd
      };
      console.log($scope.signUpContent);
      user.register($scope.signUpContent, function(data) {
        $scope.loginButton = true;
        $scope.registerButton = false;
        $scope.showFirstName = false;
        $scope.showLastName =false;
        $scope.email = '';
        $scope.pwd = '';
      }, function(error) {
        console.log(error);
        return;
      });
    };

    $scope.logIn =  function() {

      console.log($scope.email);

      $scope.loginContent = {
        "email" : $scope.email,
        "password" : $scope.pwd
      };
      user.connect($scope.loginContent, function(data) {
        $scope.loginForm = false;
        $scope.login = false;
        $scope.register = false;
        $scope.username = true;
        $scope.logout = true;
        $scope.first_name = data.first_name;
        $scope.last_name = data.last_name;

        $scope.id = data._id;
        $rootScope.user_id = $scope.id;
        $rootScope.first_name =$scope.first_name;
        $rootScope.last_name =$scope.last_name;
      }, function(error) {
        console.log(error);
        return;
      });
    };
    $scope.showLogout = function() {
      $scope.logout = false;
      $scope.login  = true;
      $scope.register = true;
      $scope.username = false;
    }
  }]);
