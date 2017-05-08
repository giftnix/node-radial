/* LIB */

const radial = require('../../radial');

/* CONSTRUCTOR */

(function () {

  var Risk = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Risk.assess = require('./assess');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Risk;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
