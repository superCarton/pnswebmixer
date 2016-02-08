/**
 * Created by vincent on 01/02/16.
 */

angular.module('frontendApp')
  .constant('CONSTANTS', {
    serverAddress: 'http://10.212.100.199:4000/',
    savePatternPath: 'pattern/save',
    loginPath: 'users/login',
    signUpPath: 'users/signup',
    getAllPatternsPath: 'pattern/collection'
  });
