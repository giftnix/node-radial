/* LIB */

const radial = require('../../radial');
const authenticate = require('./authenticate');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var PaymentSettlementStatus = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  PaymentSettlementStatus.parse = function (req, fn) {
    authenticate('paymentSettlementStatus', req, function (err) {
      if (err) {
        return fn({
          status: 401,
          type: 'Authentication Failed',
          message: err.message
        });
      }

      var body = req.body;
      var reply = body.PaymentSettlementStatusList;

      return fn(null, reply);
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = PaymentSettlementStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
