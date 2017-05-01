/* LIB */

const radial = require('../../radial');

/* CONSTRUCTOR */

(function () {

  var PayPal = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  PayPal.setExpress = require('./setExpress');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = PayPal;
  } else {
    throw new Error('This module only works with NPM in NodeJS/IO.JS environments.');
  }

}());
