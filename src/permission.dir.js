(function () {
  'use strict';

  var directives = {
    only: 'rpOnly',
    except: 'rpExcept'
  };

  var EXCEPTIONS = {
      UNDEFINED_RP_BEHAVIOR: 'Specified behavior cannot be applied. Please check your spelling in the pe-behavior attribute'
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

  function checkPermissions(directiveName, element, attrs, Permission) {
    var roleMap = {};
    var roles = attrs[directiveName].replace(/\[|]|'/gi, '').split(',');
    roleMap[(directiveName === directives.only ? 'only' : 'except')] = roles;

    var behavior = (attrs.rpBehavior ? attrs.rpBehavior : 'hide');
    var authorizing = Permission.authorize(roleMap, null);
    authorizing.then(null, function() {
      applyElementBehavior(element, behavior);
    });
  }

  function applyElementBehavior(element, behavior) {
    switch(behavior) {
      case 'hide':
        element.addClass('ng-hide');
        break;

      case 'disable':
        element.attr('disabled', 'disabled');
        break;

      default:
        throw new Error(EXCEPTIONS.UNDEFINED_RP_BEHAVIOR);
      }
  }

}());
