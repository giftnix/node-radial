/* LIB */

const radial = require('../../radial');

/* CONSTRUCTOR */

(function () {

  var Webhook = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Webhook.riskOrderStatus = require('./riskOrderStatus');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Webhook;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
