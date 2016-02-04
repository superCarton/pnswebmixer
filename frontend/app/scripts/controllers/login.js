'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function ($scope, $rootScope, UserFactory) {

    /************* INIT ****************/

    var json_to_send;

    $scope.init = function () {
      $scope.logoutMenuOn = false;
      $scope.loginMenuOn = true;
      $scope.registerMenuOn = true;
      $scope.loginForm = false;
      $scope.loginButton = false;
      $scope.connected = false;
      json_to_send = [];
    };

    /************* SHOW STUFF FUNCTIONS *************/

    $scope.showSignUp = function () {
      json_to_send = [];
      $("#lastNameLogin").required = true;
      $("#firstNameLogin").required = true;
      $scope.loginForm = true;
      $scope.loginButton = false;
      $scope.registerButton = true;
      $scope.showLastName = true;
      $scope.showFirstName = true;
    }

    $scope.showLogin = function () {
      json_to_send = [];
      $("#lastNameLogin").required = false;
      $("#firstNameLogin").required = false;
      $scope.loginForm = true;
      $scope.loginButton = true;
      $scope.registerButton = false;
      $scope.showFirstName = false;
      $scope.showLastName = false;
    }

    $scope.showLogout = function () {
      $scope.logout = false;
      $scope.login = true;
      $scope.register = true;
      $scope.username = false;
    }

    /************ SIGN UP *************/

    $scope.signUp = function (firstName, lastName, myEmail, pwd) {
      json_to_send = {
        first_name: firstName,
        last_name: lastName,
        email: myEmail,
        password: pwd
      };

      UserFactory.signUpToServer(json_to_send).then(function (data) {
        $rootScope.user_id = data._id;
        $scope.connected = true;
        $scope.logoutMenuOn = true;
        $scope.firstName = data.first_name;
        $scope.lastName = data.last_name;
        $scope.email = data.email;
        $scope.pwd = data.password;
      }, function (err) {
        //TODO: handle server error
      });
    }

    /************ LOG IN *************/

    $scope.logIn = function (mail, pwd) {
      json_to_send = {
        email: mail,
        password: pwd
      };

      UserFactory.loginToServer(json_to_send).then(function (data) {
        $rootScope.user_id = data._id;
        $scope.connected = true;
        $scope.logoutMenuOn = true;
        $scope.firstName = data.first_name;
        $scope.lastName = data.last_name;
        $scope.email = data.email;
        $scope.pwd = data.password;
      }, function (err) {
        //TODO: handle server error
      });
    }

  });
