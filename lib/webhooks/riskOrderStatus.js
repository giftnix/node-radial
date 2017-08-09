/* LIB */

const radial = require('../../radial');
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

      var body = req.body;
      var reply = body.riskassessmentreplylist;

      if (!reply) {
        return fn({
          status: 400,
          type: 'Invalid Parameters',
          message: 'The message body for this endpoint seems to be empty'
        });
      }

      var list = reply.riskassessmentreply;

      var replyList = [];
      list.forEach(function (item) {
        replyList.push({
          orderId: item.orderid[0],
          responseCode: item.responsecode[0],
          storeId: item.storeid[0],
          reasonCode: item.reasoncode[0],
          reasonCodeDescription: item.reasoncodedescription[0]
        });
      });

      return fn(null, replyList);
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = RiskOrderStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
