app.factory('langService', ['$q', 'Storage', function($q, Storage){
  var service = {};
  var STORAGE_ID = "translations-langs";
  var storage = new Storage(STORAGE_ID);

  function add(lang) {
    lang.id = storage.getNewKey();

    return storage.add(lang);
  }

  // Find name of language with given language code
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
        deferred.reject("Jazyk s týmto kódom už existuje");
        return deferred.promise;
      }
    }
    // If doesnt exist, resolve
    deferred.resolve();
    return deferred.promise;
  };

  // Edit existing language
  var edit = function(lang) {
    return isUnique(lang)
      .then(function() {
        return storage.edit(lang);
      }, function(error){
        return error;
      });
  };

  // Checks if language with give already exists
  var checkDuplicate = function(code) {
    return isUnique({
      code: code,
      name: '',
      id: storage.getLastKey()+1
    });
  };

  return {
    checkDuplicate: checkDuplicate,
    getLangName:    getLangName,
    isUnique:       isUnique,
    getAll:         function() { return storage.get(); },
    add:            add,
    edit:           edit,
    remove:         function(item) { return storage.remove(item); }
  };
}]);
