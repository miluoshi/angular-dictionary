var app = angular.module('dictApp', ['ngRoute', 'LocalStorageModule', 'xeditable']);

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
        // Load controller after all data all loaded in "store"
        store: function (Storage, $injector) {
          var langsStorage = new Storage("translations-languages"),
              termsStorage = new Storage("translations-terms"),
              store = {};

          return langsStorage.get().then(function(){
            store.langs = langsStorage;
            return termsStorage.get();
          })
          .then(function() {
            store.terms = termsStorage;
            return store;
          });
        }
      }
    })
    .otherwise({ redirectTo: '/' });
}])
.run(['editableOptions', function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme
}]);

app.controller('dictCtrl', ['$scope', 'store', function($scope, store){
  $scope.languages = [{
    code: "sk",
    name: "Slovak",
    terms: [1,2,3],
    edited: true
  },
  {
    code: "en",
    name: "English",
    terms: [1],
    edited: false
  }];

  $scope.store = store;
  console.log('controller');
  console.log($scope);
}]);
