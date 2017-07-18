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
      var reply = body.RiskAssessmentReplyList || body.riskassessmentreplylist;
      var list = reply.RiskAssessmentReply || reply.riskassessmentreply;

      var replyList = [];
      list.forEach(function (item) {
        replyList.push({
          orderId: item.OrderId || item.orderid[0],
          responseCode: item.ResponseCode || item.responsecode[0],
          storeId: item.StoreId || item.storeid[0],
          reasonCode: item.ReasonCode || item.reasoncode[0],
          reasonCodeDescription: item.ReasonCodeDescription || item.reasoncodedescription[0]
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
