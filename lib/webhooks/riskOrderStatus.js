/* LIB */

const radial = require('../../../radial');
const authenticate = require('./authenticate');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var RiskOrderStatus = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  RiskOrderStatus.parse = function (req, fn) {
    authenticate('riskOrderStatus', req, function (err) {
      if (err) {
        return fn({
          status: 401,
          type: 'Authentication Failed',
          message: err.message
        });
      }

      var jsonBody = xmlConvert.xml2js(req.body, {
        compact: true
      });

      var reply = response.RiskAssessmentReplyList;
      var duplicates = reply.Fault_DUPLICATE_List;
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = RiskOrderStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
