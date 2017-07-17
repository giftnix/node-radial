/* LIB */

const radial = require('../../radial');

/* CONSTRUCTOR */

(function () {

  var Webhooks = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Webhooks.riskOrderStatus = require('./riskOrderStatus');
  Webhooks.paymentSettlementStatus = require('./paymentSettlementStatus');

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Webhooks;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
