var app = angular.module('dictApp', [
  'ngRoute',
  'LocalStorageModule',
  'xeditable'
]);

app.config(['$routeProvider', 'localStorageServiceProvider',
  function($routeProvider, localStorageServiceProvider){

    localStorageServiceProvider
    .setStorageCookieDomain('') //window.location);
    .setNotify(true, true);     // signals for actions (setItem, removeItem)

    $routeProvider.
    when('/', {
      controller: 'dictCtrl',
      templateUrl: 'dict-index.html',
      resolve: {
        langs: function(langService) {
          return langService.getAll();
        },
        terms: function(termService) {
          return termService.getAll();
        }
      }
    })
    .otherwise({ redirectTo: '/' });
}])
.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme
}]);

app.controller('dictCtrl', [
  '$scope',
  'langs',
  'terms',
  'langService',
  'termService',
  'formService',
  function($scope, langs, terms, langService, termService, formService)
{
  $scope.saving = false;
  $scope.languages = langs;
  $scope.terms = [
    { id: 1, lang: "SK", text: "Ahoj" },
    { id: 1, lang: "EN", text: "Hello" },
    { id: 1, lang: "CZ", text: "Cus" },
    { id: 2, lang: "CZ", text: "Mrkev" },
    { id: 2, lang: "SK", text: "Mrkva" }
  ];//terms;
  $scope.termsFrom = $scope.termsTo = [];
  var langFormService = {};

  $scope.$watch('addLangForm', function(addLangForm) {
    if(addLangForm) {
        langFormService = formService($scope.addLangForm);
    }
  });


  $scope.addLang = function () {
    $scope.saving = true;

    return langService.add($scope.newLang).then(function(languages) {
      $scope.languages = languages;
      $scope.newLang = {};
      langFormService.reset();
    }, function(error) {
      console.log(error);
    }).finally(function() {
      $scope.saving = false;
    });

  };

  $scope.editLangCode = function(code, language) {
    var lang = angular.extend({},language, {code: code});
    $scope.saving = true;

    return langService.edit(lang).then(function () {
      $scope.saving = false;
    });
  };

  $scope.editLangName = function(lang) {
    $scope.saving = true;

    return langService.editLang(lang).then(function(result){
        $scope.languages = result;
        return result;
      }).finally(function() {
        $scope.saving = false;
      });
  };

  $scope.removeLang = langService.remove;


}]);
