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
    var dialog;

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

        dialog = new BootstrapDialog({
          size: BootstrapDialog.SIZE_SMALL,
          title: "Inscription réussie",
          message: "Bienvenue dans le Polytech Web Mixer, " + data.first_name.bold() + ".",
        });
        dialog.realize();
        dialog.getModalHeader().css('background-color', '#5cb85c');
        dialog.getModalHeader().css('color', '#ffffff');
        dialog.getModalHeader().css('border-top-left-radius', '6px');
        dialog.getModalHeader().css('border-top-right-radius', '6px');
        dialog.open();

      }, function (err) {
        if (err != null) {
          dialog = new BootstrapDialog({
            title: "Erreur",
            message: "Il semble y avoir un problème avec le serveur... :-(",
          });
        } else {
          dialog = new BootstrapDialog({
            title: "Erreur",
            message: err
          });
        }
        dialog.realize();
        //dialog.getModalHeader().css('background-color', '#f0b054');
        dialog.getModalHeader().css('background-color', '#d9534f');
        dialog.getModalHeader().css('color', '#ffffff');
        dialog.getModalHeader().css('border-top-left-radius', '6px');
        dialog.getModalHeader().css('border-top-right-radius', '6px');
        dialog.open();
      });
    }

    /************ LOG IN *************/

    $scope.logIn = function (mail, pwd) {

      if (mail && pwd) {

        $("body, body a, body input, body button, .step-sequencer-button").css("cursor", "progress");

        json_to_send = {
          email: mail,
          password: pwd
        };

        UserFactory.loginToServer(json_to_send).then(function (data) {
          $("body, body a, body input, body button").css("cursor", "auto");
          $("body button").css("cursor", "pointer");
          $(".step-sequencer-button").css("cursor", "pointer");
          $rootScope.user_id = data._id;
          $scope.connected = true;
          $scope.logoutMenuOn = true;
          $scope.firstName = data.first_name;
          $scope.lastName = data.last_name;
          $scope.email = data.email;
          $scope.pwd = data.password;

          dialog = new BootstrapDialog({
            size: BootstrapDialog.SIZE_SMALL,
            title: "Connexion réussie",
            message: "C'est un plaisir de vous revoir, " + data.first_name.bold() + ".",
          });
          dialog.realize();
          dialog.getModalHeader().css('background-color', '#5cb85c');
          dialog.getModalHeader().css('color', '#ffffff');
          dialog.getModalHeader().css('border-top-left-radius', '6px');
          dialog.getModalHeader().css('border-top-right-radius', '6px');
          dialog.open();

        }, function (err) {
          $("body, body a, body input").css("cursor", "auto");
          $("body button").css("cursor", "pointer");
          $(".step-sequencer-button").css("cursor", "pointer");
          if (err != null) {
            dialog = new BootstrapDialog({
              title: "Erreur",
              message: "Il semble y avoir un problème avec le serveur... :-(",
            });
          } else {
            dialog = new BootstrapDialog({
              title: "Erreur",
              message: err
            });
          }
          dialog.realize();
          //dialog.getModalHeader().css('background-color', '#f0b054');
          dialog.getModalHeader().css('background-color', '#d9534f');
          dialog.getModalHeader().css('color', '#ffffff');
          dialog.getModalHeader().css('border-top-left-radius', '6px');
          dialog.getModalHeader().css('border-top-right-radius', '6px');
          dialog.open();
        });
      }
    }

  });
