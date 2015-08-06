app.factory('Storage', ['localStorageService', '$q', function(localStorageService, $q){

  function Store(storageId) {
    this.STORAGE_ID = {
      "terms": "translations-terms",
      "langs": "translations-languages"
    };
    this.terms = [];
    this.langs = [];

    // Select cookie storage if localStorage is not supported
    this.storageProvider = localStorageService.isSupported ? localStorageService : localStorageService.cookie;
  }

  Store.prototype._getAll = function(storageKey) {
    return JSON.parse(this.storageProvider.get(this.STORAGE_ID[storageKey]) || '[]');
  };

  Store.prototype._saveAll = function (storageKey) {
    this.storageProvider.set(this.STORAGE_ID[storageKey], JSON.stringify(terms));
  };

  Store.prototype.delete = function(term) {
    var deferred = $q.defer();

    this.terms.splice(this.terms.indexOf(term), 1);

    this._saveAll(this.terms);
    deferred.resolve(this.terms);

    return deferred.promise;
  };

  Store.prototype.get = function() {
    var deferred = $q.defer();

    angular.copy(this._getAll(), this.terms);
    deferred.resolve(this.terms);

    return deferred.promise;
  };

  Store.prototype.insert = function(term) {
    var deferred = $q.defer();

    this.terms.push(term);

    this._saveAll(this.terms);
    deferred.resolve(this.terms);

    return deferred.promise;
  };

  Store.prototype.put = function(term, index) {
    var deferred = $q.defer();

    this.terms[index] = term;

    this._saveAll(this.terms);
    deferred.resolve(this.terms);

    return deferred.promise;
  };

  return Store;
}]);
