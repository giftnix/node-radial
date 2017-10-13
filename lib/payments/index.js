/* LIB */

const radial = require('../../radial');

/* CONSTRUCTOR */

(function () {

  var Payments = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Payments.settlement = require('./settlement');
  Payments.auth = require('./auth');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Payments;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
