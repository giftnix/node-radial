/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

/* CONSTRUCTOR */

(function () {

  var Assess = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Assess.execute = function (fn) {

  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Assess.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
