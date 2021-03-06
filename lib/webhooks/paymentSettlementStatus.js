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
          status: 403,
          type: 'Authentication Failed',
          message: err.message
        });
      }

      var body = req.body;
      var reply = body.paymentsettlementstatuslist;

      if (!reply) {
        return fn({
          status: 400,
          type: 'Invalid Parameters',
          message: 'The message body for this endpoint seems to be empty'
        });
      }

      var list = reply.paymentsettlementstatus;

      var replyList = [];
      list.forEach(function (item) {
        var reply = {};

        reply.storeId = item.storeid[0];

        reply.paymentContext = {
          orderId: item.paymentcontextbase ?
            item.paymentcontextbase[0].orderid[0] : item.paymentcontext[0].orderid[0],
        };

        if (item.paymentcontext && item.paymentcontext.paymentaccountuniqueid) {
          reply.paymentContext.paymentAccountUniqueId =
            item.paymentcontext.paymentaccountuniqueid[0]._;
          reply.paymentContext.paymentAccountUniqueIdIsToken =
            item.paymentcontext.paymentaccountuniqueid[0].$.isToken;
        }

        reply.tenderType = item.tendertype[0];
        reply.amount = parseFloat(item.amount[0]._);
        reply.currencyCode = item.amount[0].$.currencyCode;
        reply.settlementType = item.settlementtype[0];
        reply.settlementStatus = item.settlementstatus[0];

        if (item.declinereason) {
          reply.declineReason = item.declinereason[0];
        }

        replyList.push(reply);
      });

      return fn(null, replyList);
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = PaymentSettlementStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
