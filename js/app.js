var app = angular.module('dictApp', [
  'ngRoute',
  'LocalStorageModule',
  'xeditable'
]);

/* Config */
app.config(['$routeProvider', 'localStorageServiceProvider',
  function($routeProvider, localStorageServiceProvider){

    localStorageServiceProvider
    .setStorageCookieDomain('');

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
