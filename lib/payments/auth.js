/* LIB */

const radial = require('../../radial');
const params = radial.getParams();
const utils = require('../utils');
const sendRequest = require('../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var Auth = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Auth.cancel = function (options, fn) {
    const genericError = 'Error calling Payments/Auth/Cancel - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.tenderType !== 'string') {
      return fn(genericError + '"tenderType" must be provided in the request params as a string.');
    } else if (typeof options.requestId !== 'string') {
      return fn(genericError + '"requestId" must be provided in the request params as a string.');
    } else if (typeof options.paymentContext !== 'object') {
      return fn(genericError + '"paymentContext" must be provided in the request params as an object.');
    } else if (typeof options.currencyCode !== 'string') {
      return fn(genericError + '"currencyCode" must be provided in the request params as a string.');
    } else if (typeof options.amount !== 'number') {
      return fn(genericError + '"amount" must be provided in the request params as a number.');
    }

    var storeParams = utils.getStoreParams(options.storeCode);
    var createSettlementUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
      '/payments/auth/cancel/' + options.tenderType + '.xml';

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8',
          standalone: 'yes'
        }
      },
      PaymentAuthCancelRequest: {
        _attributes: {
          requestId: options.requestId,
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
        }
      }
    };

    var authCancelRequest = postBodyJson.PaymentAuthCancelRequest;

    if (options.paymentContext.accountUniqueId) {
      // PaymentContext if paymentAccountUniqueId is present
      authCancelRequest.PaymentContext = {
        OrderId: {
          _text: options.paymentContext.orderId
        },
        PaymentAccountUniqueId: {
          _attributes: {
            isToken: options.paymentContext.accountUniqueIdIstoken.toString()
          },
          _text: options.paymentContext.accountUniqueId
        }
      };
    } else {
      // PaymentContextBase if paymentAccountUniqueId is not present
      authCancelRequest.PaymentContextBase = {
        OrderId: {
          _text: options.paymentContext.orderId
        }
      };
    }

    authCancelRequest.Amount = {
      _attributes: {
        currencyCode: options.currencyCode
      },
      _text: options.amount.toFixed(2)
    }

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });

    sendRequest({
      storeParams: storeParams,
      resource: createSettlementUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      if (params.debugMode === true) console.log(response);

      var reply = response.AckReply;

      return fn(null, {
        received: true
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Auth;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
