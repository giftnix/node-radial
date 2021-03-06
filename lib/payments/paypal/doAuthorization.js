/* LIB */

const radial = require('../../../radial');
const params = radial.getParams();
const utils = require('../../utils');
const sendRequest = require('../../sendRequestXML');

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

    var storeParams = utils.getStoreParams(options.storeCode);
    var doAuthorizationUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
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
      storeParams: storeParams,
      resource: doAuthorizationUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.PayPalDoAuthorizationReply;
      if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        authorizationInfo: {
          paymentStatus: reply.AuthorizationInfo && reply.AuthorizationInfo.PaymentStatus ?
            reply.AuthorizationInfo.PaymentStatus._text : undefined,
          pendingReason: reply.AuthorizationInfo && reply.AuthorizationInfo.PendingReason ?
            reply.AuthorizationInfo.PendingReason._text : undefined,
          reasonCode: reply.AuthorizationInfo && reply.AuthorizationInfo.ReasonCode ?
            reply.AuthorizationInfo.ReasonCode._text : undefined
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
