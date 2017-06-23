/* LIB */

const radial = require('../../../radial');
const params = radial.getParams();
const utils = require('../../utils');
const sendRequest = require('../../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var Settlement = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  Settlement.create = function (options, fn) {
    const genericError = 'Error calling Payments/Settlement/Create - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.tenderType !== 'string') {
      return fn(genericError + '"tenderType" must be provided in the request params as a string.');
    } else if (typeof options.requestId !== 'string') {
      return fn(genericError + '"requestId" must be provided in the request params as a string.');
    }

    var storeParams = utils.getStoreParams(options.storeCode);
    var createSettlementUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
      '/payments/settlement/create/' + options.tenderType + '.xml';

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8',
          standalone: 'yes'
        }
      },
      PaymentSettlementRequest: {
        _attributes: {
          requestId: options.requestId,
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
        }
      }
    };

    var settlementRequest = postBodyJson.PaymentSettlementRequest;

    // PaymentContext if PaymentAccountUniqueId is present


    // PaymentContextBase if PaymentAccountUniqueId is not present

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });

    sendRequest({
      storeParams: storeParams,
      resource: assessUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.AckReply;

      return fn(null, {
        received: true
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Settlement;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
