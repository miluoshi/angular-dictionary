/* Controller */
app.controller('dictCtrl', [
'$scope',
'langs',
'terms',
'langService',
'termService',
'formService',
function($scope, langs, terms, langService, termService, formService) {
  $scope.languages = langs;
  $scope.termsFrom = $scope.termsTo = [];
  var langFormService = {},
      termFormService = {};

  // Watch changes in selected translation languages
  $scope.$watchGroup(['languageFrom', 'languageTo'], function(newValues){
    $scope.terms = termService.getTranslations(newValues[0], newValues[1]);
  });

  // Load form services after form has been loaded
  $scope.$watch('addLangForm', function(addLangForm) {
    if(addLangForm)
      langFormService = formService($scope.addLangForm);
  });
  $scope.$watch('addTermForm', function(addTermForm) {
    if(addTermForm)
      termFormService = formService($scope.addTermForm);
  });

  // Add new language
  $scope.addLang = function () {
    return langService.add($scope.newLang).then(function(languages) {
      $scope.languages = languages;
      $scope.newLang = {};
      langFormService.reset();
    });

  };

  $scope.editLangCode = function(code, language) {
    var lang = angular.extend({},language, {code: code});

    return langService.edit(lang);
  };

  $scope.editLangName = function(lang) {
    return langService.editLang(lang).then(function(result){
        $scope.languages = result;
        return result;
      });
  };

  $scope.removeLang = function(lang) {
    var resetLang;
    if($scope.languageFrom == lang.code)
      resetLang = "languageFrom";
    if($scope.languageTo == lang.code)
      resetLang = "languageTo";

    return langService.remove(lang).then(function(langs) {
      $scope[resetLang] = "";
    });
  };

  $scope.checkTermForm = function(form) {
    if( !$scope.languageFrom || !$scope.languageTo ) {
      return "Vyber si 2 jazyky prekladu, potom to pojde;)";
    }

    if(!form.termFrom && !form.termTo) {
      return "Aspoň jeden výraz musí byť vyplnený";
    }
  };

  $scope.saveTerms = function(data, term) {
    term.to.lang = $scope.languageTo;

    return termService.save(term).then(function() {
      $scope.terms = termService.getTranslations($scope.languageFrom, $scope.languageTo);
    });
  };

  // remove user
  $scope.removeTerm = function(index, term) {
    if( typeof term.id !== "undefined" ) {
      termService.remove(term);
    }
    $scope.terms.splice(index, 1);
  };

  $scope.cancel = function(index, term, form) {
    if(typeof term.id == "undefined") {
      $scope.terms.splice(index, 1);
    }
    form.$cancel();
  };

  // add term
  $scope.addTerm = function() {
    $scope.inserted = {
      from: {
        lang: $scope.languageFrom,
        text: ""
      },
      to: {
        lang: $scope.languageTo,
        text: ""
      }
    };
    $scope.terms.push($scope.inserted);
  };
}]);
