angular.module('starter')
  .directive('keydown', function() {
    return {
      scope: {
        onKeydownFunc: '='
      },
      link: function(scope, element, attrs) {

        element.bind('keydown', function(e) {
          console.log('lalal');
          if (e.which === 37) {
            scope.onKeydownFunc(0);
            console.log(e.which)
          } else if (e.which === 39) {
            scope.onKeydownFunc(0);
            console.log(e.which)
          }
          $scope.$apply();

        });
      }
    }
  });
