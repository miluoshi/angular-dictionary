app.factory('formService', function($timeout, $window) {

  function Form(formEl) {
    this.form = formEl;

    this.reset = function() {
      this.form.$setPristine();
      this.form.$setUntouched();
    };
  }

  return function(form) {
    return new Form(form);
  };
});
