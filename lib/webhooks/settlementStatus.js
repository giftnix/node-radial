/* LIB */

const radial = require('../../radial');
const authenticate = require('./authenticate');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var SettlementStatus = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  SettlementStatus.parse = function (req, fn) {
    authenticate('settlementStatus', req, function (err) {
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
    module.exports = SettlementStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
