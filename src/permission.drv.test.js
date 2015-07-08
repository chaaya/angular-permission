describe('Permission directive', function() {
  var $compile, $scope, Permission;
  var EXCEPTIONS = {
      UNDEFINED_RP_BEHAVIOR: new Error('rp-behavior is undefined. Check your spelling, it can be either hide or disable!'),
      UNDEFINE_ROLE_OR_VALIDATION: new Error('undefined role or invalid role validation')
  }


  // Load the myApp module, which contains the directive
  beforeEach(module('permission'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _Permission_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    Permission = _Permission_;
  }));

  beforeEach(inject(function(){
    // setup Permission
    var systemRoles = ['admin', 'publisher', 'guest'];
    var userRoles = ['publisher'];

    function hasRole(roleName) {
      var hasRole = (userRoles.indexOf(roleName) != -1);
      return hasRole;
    }

    Permission.defineManyRoles(systemRoles, function(stateParams, roleName) {
      return hasRole(roleName);
    });

  }));

  describe('rp-only', function() {
    it('should throw undefined role or validation', function() {
      expect(function () {
        var element = $compile('<button rp-only="myundefinedrole" ></button>')($scope);
        $scope.$digest();
      }).toThrow(EXCEPTIONS.UNDEFINE_ROLE_OR_VALIDATION);

    });

    it('should not throw an undefined behavior exception', function() {

      expect(function () {
        var element = $compile('<button rp-only="publisher" rp-behavior="disable"></button>')($scope);
        $scope.$digest();
      }).not.toThrow(EXCEPTIONS.UNDEFINED_RP_BEHAVIOR);

    });

    it('should throw an undefined behavior exception', function() {

      expect(function () {
        var element = $compile('<button rp-only="admin" rp-behavior="close"></button>')($scope);
        $scope.$digest();
      }).toThrow(EXCEPTIONS.UNDEFINED_RP_BEHAVIOR);

    });

    it('should set invisible as default behavior', function() {

      var element = $compile('<button rp-only="admin"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(true);

    });


    it('should be invisible', function() {

      var element = $compile('<button rp-only="admin" rp-behavior="hide"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(true);

    });


    it('should be visible', function() {

      var element = $compile('<button rp-only="publisher"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(false);

    });

    it('should not be disabled', function() {

      var element = $compile('<button rp-only="publisher" rp-behavior="disable"></button>')($scope);
      $scope.$digest();
      expect(element.attr('disabled')).not.toBeDefined();

    });

    it('should be disabled', function() {

      var element = $compile('<button rp-only="admin" rp-behavior="disable"></button>')($scope);
      $scope.$digest();
      expect(element.attr('disabled')).toBeDefined();

    });
  });

  describe('rp-except', function() {
    it('should throw undefined role or validation', function() {
      expect(function () {
        var element = $compile('<button rp-only="myundefinedrole" ></button>')($scope);
        $scope.$digest();
      }).toThrow(EXCEPTIONS.UNDEFINE_ROLE_OR_VALIDATION);

    });

    it('should throw an undefined behavior exception', function() {

      expect(function () {
        var element = $compile('<button rp-only="admin" rp-behavior="close"></button>')($scope);
        $scope.$digest();
      }).toThrow(EXCEPTIONS.UNDEFINED_RP_BEHAVIOR);

    });

    it('should set invisible as default behavior', function() {

      var element = $compile('<button rp-except="publisher"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(true);

    });

    it('should be invisible', function() {

      var element = $compile('<button rp-except="publisher" rp-behavior="hide"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(true);

    });


    it('should be visible', function() {

      var element = $compile('<button rp-except="admin"></button>')($scope);
      $scope.$digest();
      expect(element.hasClass('ng-hide')).toBe(false);

    });

    it('should not be disabled', function() {

      var element = $compile('<button rp-except="admin" rp-behavior="disable"></button>')($scope);
      $scope.$digest();
      expect(element.attr('disabled')).not.toBeDefined();

    });

    it('should be disabled', function() {

      var element = $compile('<button rp-except="publisher" rp-behavior="disable"></button>')($scope);
      $scope.$digest();
      expect(element.attr('disabled')).toBeDefined();

    });
  });




});
