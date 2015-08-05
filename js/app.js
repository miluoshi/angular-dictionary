var app = angular.module('dictApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){

  }])

  .controller('dict', function(){

  })

  .service('storage', ['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider
    .setStorageCookieDomain('') //window.location);
    .setNotify(true, true);     // signals for actions (setItem, removeItem)

    // To add to local storage
    localStorageService.set('localStorageKey','Add this!');
    // Read that value back
    var value = localStorageService.get('localStorageKey');
    // To remove a local storage
    localStorageService.remove('localStorageKey');
    // Removes all local storage
    localStorageService.clearAll();
    // You can also play with cookies the same way
    localStorageService.cookie.set('localStorageKey','I am a cookie value now');

    if( localStorageService.isSupported ) {

      JSON.stringify({
        id: 0,
        lang: 'en',
        text: 'something'
      })
      localStorageService.set(key, JSON.stringify(val));
      val = JSON.parse(localStorageService.get(key));
      localStorageService.remove(key);

    } else if( localStorageService.cookie.isSupported ) {

      localStorageService.cookie.set(key, val);
      localStorageService.cookie.get(key);
      localStorageService.cookie.remove(key);

    } else {
      throw error;
    }
  }])
