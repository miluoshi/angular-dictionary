// Directive providing async validator for checking for duplicate entries
app.directive('checkDuplicate', ['$injector', function($injector){
   return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
          var storageName = attr.checkDuplicate;
          var service = {};

          if(storageName == "lang") {
            service = $injector.get('langService');
          }
          if(storageName == "term") {
            service = $injector.get('termService');
          }

          ngModel.$asyncValidators.checkDuplicate = service.checkDuplicate;
      }
   };
}]);

// Check if "Language From" and "Language To" selected options are not same
// otherwise swap their values
app.directive('checkLanguage', function(){
  return {
    link: function(scope, element, attrs){

      scope.$watch('languageFrom', function (newValue, oldValue) {

        if(newValue && scope.languageTo === scope.languageFrom) {
          scope.languageFrom = newValue;
          scope.languageTo = oldValue;
        }

      });
      scope.$watch('languageTo', function(newValue, oldValue) {

        if(newValue && scope.languageTo === scope.languageFrom) {
          scope.languageTo = newValue;
          scope.languageFrom = oldValue;
        }

      });
    }
  };
});
