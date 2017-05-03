/* LIB */

const radial = require('../../../radial');

/* CONSTRUCTOR */

(function () {

  var CreditCard = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  CreditCard.tokenize = require('./tokenize');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = CreditCard;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
