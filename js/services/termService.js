app.factory('termService', ['Storage', function(Storage){
  var service = {};
  var STORAGE_ID = "translations-terms";
  var storage = new Storage(STORAGE_ID);
  var terms = storage.get();


  function getVocabulary(langCode) {
    //var items =
  }

	function pickTerms(langFrom, langTo) {

  }

  return {
    /*add:          storage.add,
    edit:         storage.edit,

    getNewKey:    storage.getNewKey,
    isUnique:     isUnique,
    remove:       storage.remove,*/
    getAll:       function() { storage.get(); },
  };
}]);
