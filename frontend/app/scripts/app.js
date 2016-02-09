'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular.module('frontendApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngDraggable',
  'ngStorage',
  'ui.bootstrap'
]).config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/allComments/:link', {
      templateUrl: '../views/comment.html',
      controller: 'AllcommentsCtrl',
      controllerAs: 'allComments'
    })
    .otherwise({
      redirectTo: '/'
    });
});
