(function () {
  'use strict';

  var directives = {
    only: 'rpOnly',
    except: 'rpExcept'
  };

  var elementBehaviors = {
    'hide': function(element) {
      element.addClass('ng-hide');
    },
    'disable': function(element) {
      element.attr('disabled', 'disabled');
    }
  }

  var EXCEPTIONS = {
      UNDEFINED_RP_BEHAVIOR: 'rp-behavior is undefined. Check your spelling, it can be either hide or disable!'
  }

  angular.module('permission')
    .directive(directives.only, only)

  angular.module('permission')
    .directive(directives.except, except)

  only.$inject = ['$q', 'Permission'];
  except.$inject = ['$q', 'Permission'];

  function only($q, Permission) {
    var directive = {
      restrict: 'A',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {
      checkPermissions(directives.only, element, attrs, Permission);
    }
  }

  function except($q, Permission) {
    var directive = {
      restrict: 'A',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {
      checkPermissions(directives.except, element, attrs, Permission);
    }
  }

  function validateBehaviorParams(behavior) {
    if(!elementBehaviors[behavior]) {
      throw new Error(EXCEPTIONS.UNDEFINED_RP_BEHAVIOR);
    }
  }

  function checkPermissions(directiveName, element, attrs, Permission) {
    var roleMap = {};
    var roles = attrs[directiveName].replace(/\[|]|'/gi, '').split(',');
    roleMap[(directiveName === directives.only ? 'only' : 'except')] = roles;

    var behavior = (attrs.rpBehavior ? attrs.rpBehavior : 'hide');
    validateBehaviorParams(behavior);

    var authorizing = Permission.authorize(roleMap, null);
    authorizing.then(null, function() {
      //authorize rejected -> apply behavior to element
      elementBehaviors[behavior](element);
    });
  }


}());
