app.factory('langService', ['$q', 'Storage', function($q, Storage){
  var service = {};
  var STORAGE_ID = "translations-langs";
  var storage = new Storage(STORAGE_ID);

	function getLangName(code) {
    for(var i in storage.items) {
      if( storage.items[i].code === code)
        return storage.items[i].name;
    }
    return '';
  }

  // item to look for in storage and storageId ("terms" or "langs")
  // for notInStorage async validator
  var isUnique = function(item) {
    var deferred = $q.defer();
    storage.get();

    for(var i in storage.items) {
      if(storage.items[i].id !== item.id && storage.items[i].code === item.code ) {
        deferred.reject("Jazyk s tymto kodom uz existuje");
        return deferred.promise;
      }
    }
    // If doesnt exist, resolve
    deferred.resolve();
    return deferred.promise;
  };

  var editLang = function(lang) {
    return isUnique(lang)
      .then(function() {
        return storage.edit(lang);
      }, function(error){
        return error;
      });
  };

  var checkDuplicate = function(value) {
    return isUnique({
      code: value,
      name: '',
      id: storage.getNewKey()
    });
  };

  return {
    checkDuplicate: checkDuplicate,
    getLangName:    getLangName,
    isUnique:       isUnique,
    getAll:         function() { return storage.get(); },
    getNewKey:      function() { return storage.getNewKey(); },
    add:            function(lang) { return storage.add(lang); },
    edit:           editLang,
    remove:         function(item) { return storage.remove(item); }
  };
}]);
