/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

/* CONSTRUCTOR */

(function () {

  var Utils = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Utils.isInteger = function (n) {
    return parseInt(n) === n;
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Utils;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
