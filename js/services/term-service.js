app.factory('termService', ['Storage', '$q', function(Storage, $q){
  var service = {};
  var STORAGE_ID = "translations-terms";
  var storage = new Storage(STORAGE_ID);

  // Accepts object storing 2 objects "from" and "to"
  // each having properties: lang, text (optional id)
  function save(term) {
    var id;

    // Saving the new term (no ID key provided)
    if( !term.id ) {
      // Find same term in same language and return it's id if exists
      id = findDuplicateTermId(term);

      // If haven't found duplicate, add new terms
      if( id == -1 ) {
        id = storage.getNewKey();

        angular.extend(term.from, {id: id});
        angular.extend(term.to, {id: id});

        return storage.add(term.from).then(function() {
          return storage.add(term.to);
        });

      } else {
        // Update found existing term
        term.id = id;
        return edit(term);
      }
    }
    // Editing existing term
    else {
      return edit(term);
    }
  }

  /*
   * Edits "from" and "to" terms.
   * If "to" doesn't exist yet, it will be added to storage
   */
  function edit(term) {
    var id = term.id;
    var promise;

    angular.extend(term.from, {id:id});
    angular.extend(term.to, {id:id});

    // treba zistit, ci term uz existuje, ak nie, tak ho pridame
    if( exists(term.from) > -1) {
      promise = storage.edit( term.from );
    } else {
      promise = storage.add( term.from );
    }
    if( exists(term.to) > -1) {
      return promise.then(function() {
        return storage.edit( term.to );
      });
    } else {
      return promise.then(function() {
        return storage.add( term.to );
      });
    }
  }

  /*
   * Checks if a term already exists in storage
   * and returns it's indice if it does
   */
  function exists(term) {
    for(var i in storage.items) {
      if( storage.items[i].id === term.id &&
          storage.items[i].lang === term.lang )
          return i;
    }
    return -1;
  }

  function getVocabulary(langCode) {
    var vocabulary = [];

    for(var i in storage.items) {
      if(storage.items[i].lang == langCode && storage.items[i].text)
        vocabulary.push(storage.items[i]);
    }

    // Sort vocabulary by ID ascending
    vocabulary.sort(function(a,b) {
      return a.id - b.id;
    });

    return vocabulary;
  }

  /*
   * Get all terms from first language and then
   * all their existing translations in second language
   */
  function getTranslations(langFrom, langTo) {
    var terms = [];

    if( !langFrom ) {
      return terms;
    }

    var vocabFrom = getVocabulary(langFrom),
        vocabTo   = getVocabulary(langTo);

    // For each term in "langFrom" get a term in "langTo" if it exists
    angular.forEach(vocabFrom, function(termFrom, keyFrom){
      terms.push({
        id: termFrom.id,
        from: {
          lang: termFrom.lang,
          text: termFrom.text
        },
        to: {}
      });

      if( vocabTo.length ) {
        angular.forEach(vocabTo, function(termTo, keyTo){
          if( termTo.id == terms[keyFrom].id && termTo.text){
            angular.extend(terms[keyFrom].to, {
              lang: termTo.lang,
              text: termTo.text
            });
          }
        });
      }
    });

    return terms;
  }

  /*
   * Attempts to find same term in same language,
   * if such term exists, then return it's ID
   */
  var findDuplicateTermId = function(item) {

    for(var i in storage.items) {
      if( storage.items[i].text === item.from.text &&
          storage.items[i].lang === item.from.lang ) {
          return storage.items[i].id;
      }
      if( storage.items[i].text === item.to.text &&
          storage.items[i].lang === item.to.lang ) {
          return storage.items[i].id;
      }
    }

    return -1;
  };

  /*
   * Removes existing term
   */
  var remove = function(term) {
    var id = term.id;
    angular.extend(term.from, {id:id});
    angular.extend(term.to, {id:id});

    return storage.remove([term.from, term.to]);
  };

  return {
    getVocabulary:    getVocabulary,
    getTranslations:  getTranslations,
    save:             save,
    remove:           remove,
    getAll:           function() { return storage.get(); }
  };
}]);
