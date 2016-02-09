'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $cookies, UserFactory) {

    /************* INIT ****************/

    var json_to_send;
    var dialog;

    $scope.init = function () {

      $rootScope.clearAllPatterns();

      json_to_send = [];

      // check if we are connected
      var isConnected=$cookies.get("connected");
      console.log("cookie connected : " +isConnected);

      if (isConnected=="true"){

        console.log("Déjà connecté");

        $scope.logoutMenuOn = true;
        $scope.loginMenuOn = false;
        $scope.registerMenuOn = false;

        $scope.loginForm = false;
        $scope.loginButton = false;

        $scope.first_name = $cookies.get('first_name');
        $scope.last_name = $cookies.get('last_name');
        $scope.myEmail = $cookies.get('myEmail');
        $scope.pwd = $cookies.get('pwd');

        $rootScope.connected = "true";
        $rootScope.user_id = $cookies.get('user_id');
        $rootScope.first_name = $cookies.get('first_name');

      } else {

        console.log("Non connecté");

        $scope.logoutMenuOn = false;
        $scope.loginMenuOn = true;
        $scope.registerMenuOn = true;

        $scope.loginForm = false;
        $scope.loginButton = false;

        $scope.first_name = '';
        $scope.last_name = '';
        $scope.myEmail = '';
        $scope.pwd = '';

        $rootScope.connected = false;
        $rootScope.user_id = '';
        $rootScope.first_name = '';

        $cookies.put('connected', "false");
        $cookies.put('user_id', '');
        $cookies.put('first_name', '');
        $cookies.put('last_name', '');
        $cookies.put('myEmail', '');
        $cookies.put('pwd', '');
      }
    };

    /************* SHOW STUFF FUNCTIONS *************/

    $scope.showSignUp = function () {

      json_to_send = [];

      $scope.first_name = '';
      $scope.last_name = '';
      $scope.myEmail = '';
      $scope.pwd = '';

      $("#lastNameLogin").required = true;
      $("#firstNameLogin").required = true;

      $scope.loginForm = true;
      $scope.loginButton = false;
      $scope.registerButton = true;

      $scope.showLastName = true;
      $scope.showFirstName = true;
    };

    $scope.showLogin = function () {
      json_to_send = [];

      $scope.first_name = '';
      $scope.last_name = '';
      $scope.myEmail = '';
      $scope.pwd = '';

      $("#lastNameLogin").required = false;
      $("#firstNameLogin").required = false;

      $scope.loginForm = true;
      $scope.loginButton = true;
      $scope.registerButton = false;

      $scope.showFirstName = false;
      $scope.showLastName = false;
    };

    $scope.showLogout = function () {

      $cookies.put('connected', "false");
      $rootScope.clearAllPatterns();
      $scope.init();
      $scope.showLogin();
    };

    /************ SIGN UP *************/

    $scope.signUp = function (firstName, lastName, myEmail, pwd) {

      // Doing some CSS for the waiting cursor
      $("body, body a, body input, body button, .step-sequencer-button").css("cursor", "progress");

      json_to_send = {
        first_name: firstName,
        last_name: lastName,
        email: myEmail,
        password: pwd
      };

      UserFactory.signUpToServer(json_to_send).then(function (data) {

        // Doing some CSS for the waiting cursor
        $("body, body a, body input, body button").css("cursor", "auto");
        $("body button").css("cursor", "pointer");
        $(".step-sequencer-button").css("cursor", "pointer");


        // boolean for displaying appropriate menus
        $scope.logoutMenuOn = true;
        $scope.loginMenuOn = false;
        $scope.registerMenuOn = false;
        $scope.loginForm = false;

        // local scope attributes for displaying
        $scope.first_name = data.first_name;
        $scope.last_name = data.last_name;
        $scope.myEmail = '';
        $scope.pwd = '';

        // setting rootScope values
        $rootScope.user_id = data._id;
        $rootScope.first_name = data.first_name;
        $rootScope.connected = true;

        // adding to cookies
        $cookies.put('connected', "true");
        $cookies.put('user_id', data._id);
        $cookies.put('first_name', data.first_name);
        $cookies.put('last_name', data.last_name);
        $cookies.put('myEmail', '');
        $cookies.put('pwd', '');

        // load the patters
        $rootScope.getAllPatterns();
        $rootScope.getMyPatterns();

        // response modal
        dialog = new BootstrapDialog({
          title: "Inscription réussie",
          message: "Bienvenue dans le Polytech Web Mixer, " + data.first_name.bold() + "."
        });

        dialog.realize();
        dialog.getModalHeader().css('background-color', '#5cb85c');
        dialog.getModalHeader().css('color', '#ffffff');
        dialog.getModalHeader().css('border-top-left-radius', '6px');
        dialog.getModalHeader().css('border-top-right-radius', '6px');
        dialog.open();

      }, function (err) {
        if (err == null) {
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

        // Doing some CSS for the waiting cursor
        $("body, body a, body input, body button, .step-sequencer-button").css("cursor", "progress");

        json_to_send = {
          email: mail,
          password: pwd
        };

        UserFactory.loginToServer(json_to_send).then(function (data) {

          // Doing some CSS for the waiting cursor
          $("body, body a, body input, body button").css("cursor", "auto");
          $("body button").css("cursor", "pointer");
          $(".step-sequencer-button").css("cursor", "pointer");

          // boolean for displaying appropriate menus
          $scope.logoutMenuOn = true;
          $scope.loginMenuOn = false;
          $scope.registerMenuOn = false;
          $scope.loginForm = false;

          // local scope attributes for displaying
          $scope.first_name = data.first_name;
          $scope.last_name = data.last_name;
          $scope.myEmail = '';
          $scope.pwd = '';

          // setting rootScope values
          $rootScope.user_id = data._id;
          $rootScope.first_name = data.first_name;
          $rootScope.connected = true;

          // adding to cookies
          $cookies.put('connected', "true");
          $cookies.put('user_id', data._id);
          $cookies.put('first_name', data.first_name);
          $cookies.put('last_name', data.last_name);
          $cookies.put('myEmail', '');
          $cookies.put('pwd', '');

          // load the patters
          $rootScope.getAllPatterns();
          $rootScope.getMyPatterns();

          // response modal
          dialog = new BootstrapDialog({
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

          // Doing some CSS for the waiting cursor
          $("body, body a, body input").css("cursor", "auto");
          $("body button").css("cursor", "pointer");
          $(".step-sequencer-button").css("cursor", "pointer");

          if (err == null) {
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
          dialog.getModalHeader().css('background-color', '#d9534f');
          dialog.getModalHeader().css('color', '#ffffff');
          dialog.getModalHeader().css('border-top-left-radius', '6px');
          dialog.getModalHeader().css('border-top-right-radius', '6px');
          dialog.open();
        });
      }
    }
  });
