'use strict';

describe('Controller: AllcommentsCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var AllcommentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllcommentsCtrl = $controller('AllcommentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
