//
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

app.directive('termPlaceholder', function(){
  return {
    link: function (scope, element, attrs) {
      //console.log(attrs.termPlaceholder);
      var placeholder = attrs.termPlaceholder ? 'Fráza v jazyku' + scope.getLangName(attrs.termPlaceholder) : 'Vyber si najprv hore jazyk';
      //console.log(placeholder);
      attrs.$set('placeholder', placeholder);
      scope.$watch('langCode', function(newVal, oldVal){
        var placeholder = newVal ? 'Fráza v jazyku' + scope.getLangName(newVal) : 'Vyber si najprv hore jazyk';
        attrs.$set('placeholder', placeholder);
      });
    }
  };
});

app.filter('filterLanguage', function() {
  return function(term, language) {

  };
});
