app.factory('Storage', ['localStorageService', '$q', function(localStorageService, $q){

  function Store(storageId) {
    this.storageId = storageId;
    this.lastKey = 0;
    this.items = [];

    // Select cookie storage if localStorage is not supported
    this.storageProvider = localStorageService.isSupported ? localStorageService : localStorageService.cookie;
  }

  Store.prototype._getAll = function() {
    return JSON.parse(this.storageProvider.get(this.storageId) || '[]');
  };

  Store.prototype._saveAll = function () {
    for(var i in this.items)
      delete this.items[i].$$hashKey;

    this.storageProvider.set(this.storageId, JSON.stringify(this._getCurrentStore()));
  };

  Store.prototype._indexOf = function(item) {
    for(var i in this.items) {
      if(this.items[i].id === item.id)
        return i;
    }
    return -1;
  };

  Store.prototype._getCurrentStore = function() {
    return {
      items: this.items,
      lastKey: this.lastKey
    };
  };

  Store.prototype.remove = function(item) {
    var deferred = $q.defer();

    this.items.splice(this._indexOf(item), 1);

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  Store.prototype.getNewKey = function () {
    this.get();

    return this.lastKey;
  };
  Store.prototype.get = function() {
    var deferred = $q.defer();

    var store = angular.extend(this._getCurrentStore(), this._getAll());
    this.items = store.items;
    this.lastKey = store.lastKey;
    delete store.items;

    deferred.resolve(this.items);

    return deferred.promise;
  };

  Store.prototype.add = function(item) {
    var deferred = $q.defer();

    item.id = this.lastKey;
    this.lastKey += 1;

    this.items.push(item);

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  Store.prototype.edit = function(item) {
    if( item.$$hashKey !== undefined )
      delete item.$$hashKey;

    var index = this._indexOf(item);

    if( index >= 0)
      return this.put(item, index);
    else {
      var deferred = $q.defer();
      $q.reject('invalid id');
      return $q.promise;
    }
  };

  Store.prototype.put = function(item, index) {
    var deferred = $q.defer();

    this.items[index] = item;

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  return Store;
}]);
