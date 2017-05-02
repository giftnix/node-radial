/* LIB */

const radial = require('../../radial');
const params = radial.getParams();
const sendRequest = require('../sendRequest');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var DoAuthorization = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  DoAuthorization.execute = function (options, fn) {
    const genericError = 'Error calling PayPal doAuthorization - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.orderId !== 'string') {
      return fn(genericError + '"orderId" must be provided in the request params as a string.');
    } else if (typeof options.amount !== 'number') {
      return fn(genericError + '"amount" must be provided in the request params as a number.');
    } else if (typeof options.currencyCode !== 'string') {
      return fn(genericError + '"currencyCode" must be provided in the request params as a string.');
    } else if (typeof options.requestId !== 'string') {
      return fn(genericError + '"requestId" must be provided in the request params as a string.');
    }

    var doAuthorizationUrl = params.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + params.storeCode +
      '/payments/paypal/doAuth.xml';

    var postBodyJson = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      elements: [{
        type: 'element',
        name: 'PayPalDoAuthorizationRequest',
        attributes: {
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0',
          requestId: options.requestId
        },
        elements: [{
          type: 'element',
          name: 'OrderId',
          elements: [{
            type: 'text',
            text: options.orderId
          }]
        }, {
          type: 'element',
          name: 'Amount',
          attributes: {
            currencyCode: options.currencyCode
          },
          elements: [{
            type: 'text',
            text: options.amount.toFixed(2)
          }]
        }, {
          type: 'element',
          name: 'SchemaVersion',
          elements: [{
            type: 'text',
            text: '1.2'
          }]
        }]
      }]
    };

    var xmlBody = xmlConvert.js2xml(postBodyJson);

    sendRequest({
      resource: doAuthorizationUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.PayPalDoAuthorizationCheckoutReply;
      if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        authorizationInfo: {
          paymentStatus: reply.AuthorizationInfo.PaymentStatus._text,
          paymentReason: reply.AuthorizationInfo.PaymentReason._text,
          paymentCode: reply.AuthorizationInfo.PaymentCode._text
        }
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = DoAuthorization.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
