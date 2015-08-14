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
    /*for(var i in this.items) {
      if(typeof this.items[i].$$hashKey !== "undefined")
        delete this.items[i].$$hashKey;
    }*/

    this.storageProvider.set(this.storageId, JSON.stringify(this._getCurrentStore()));
  };

  // Get array index of item
  Store.prototype._indexOf = function(item) {
    for(var i in this.items) {
      if(this.items[i].id === item.id && this.items[i].lang === item.lang)
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
    console.log('Store.remove');
    var deferred = $q.defer();

    if( item instanceof Array) {
      for(var i in item) {
        this.items.splice(this._indexOf(item[i]), 1);
      }
    } else {
      this.items.splice(this._indexOf(item), 1);
    }

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  Store.prototype.getLastKey = function() {
    return this.lastKey;
  };

  Store.prototype.getNewKey = function () {
    this.lastKey += 1;

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
    console.log('Store.add');
    var deferred = $q.defer();

    if( item instanceof Array) {
      for(var i in item) {
        this.items.push(item[i]);
      }
    } else {
      this.items.push(item);
    }

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  // Edit single item
  Store.prototype.editOne = function(item) {
    var index = this._indexOf(item);

    if( index >= 0)
      return this.put(item, index);
    else {
      var deferred = $q.defer();
      $q.reject('invalid id');
      return $q.promise;
    }
  };

  // Edit item. If array is provided, edit all items in array
  Store.prototype.edit = function(item) {
    console.log('Store.edit');
    var promise, p;

    if( item instanceof Array) {
      for(var i in item) {
        promise = this.editOne(item[i]);
      }
    } else {
      promise = this.editOne(item);
    }

    return promise;
  };

  // Save item to defined index in storage array
  Store.prototype.put = function(item, index) {
    var deferred = $q.defer();

    this.items[index] = item;

    this._saveAll();
    deferred.resolve(this.items);

    return deferred.promise;
  };

  /*
  Store.prototype.exists = function(item) {
    return this._indexOf(item) > -1;
  };
  */

  return Store;
}]);
