(function () {
  'use strict';

  var directives = {
    only: 'rpOnly',
    except: 'rpExcept',
    state: 'rpState'
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

  angular.module('permission')
      .directive(directives.state, state)

  only.$inject = ['$q', 'Permission'];
  except.$inject = ['$q', 'Permission'];
  state.$inject = ['$q', 'Permission', '$state'];

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

  function state($q, Permission, $state) {
    var directive = {
      restrict: 'A',
      link: link
    }
    return directive;

    function link(scope, element, attrs) {
        var states = $state.get();
        var uiStateName = attrs.uiSref;
        var currentState = states.filter(function (route) {
            return (route.name === uiStateName);
        });
        var currentState = currentState[0];

        if (currentState.data && currentState.data.permissions)
        {
            var isOnlyPermission = (currentState.data.permissions.only ? true: false);

            var roles = (isOnlyPermission ? currentState.data.permissions.only : currentState.data.permissions.except);
            roles = roles.join(",");

            var customAttributes = {};
            customAttributes[(isOnlyPermission ? directives.only : directives.except)] = roles;

            var ruleDirectiveName = (currentState.data.permissions.only ? directives.only : directives.except);
            
            checkPermissions(ruleDirectiveName, element, customAttributes, Permission);
        }

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
