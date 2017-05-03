/* LIB */

const radial = require('../../../radial');
const params = radial.getParams();
const sendRequest = require('../../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var GetExpress = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  GetExpress.execute = function (options, fn) {
    const genericError = 'Error calling PayPal getExpress - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.orderId !== 'string') {
      return fn(genericError + '"orderId" must be provided in the request params as a string.');
    } else if (typeof options.token !== 'string') {
      return fn(genericError + '"token" must be provided in the request params as a string.');
    } else if (typeof options.currencyCode !== 'string') {
      return fn(genericError + '"currencyCode" must be provided in the request params as a string.');
    }

    var getExpressUrl = params.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + params.storeCode +
      '/payments/paypal/getExpress.xml';

    var postBodyJson = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      elements: [{
        type: 'element',
        name: 'PayPalGetExpressCheckoutRequest',
        attributes: {
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
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
          name: 'Token',
          elements: [{
            type: 'text',
            text: options.token
          }]
        }, {
          type: 'element',
          name: 'CurrencyCode',
          elements: [{
            type: 'text',
            text: options.currencyCode
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
      resource: getExpressUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.PayPalGetExpressCheckoutReply;
      if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        payerId: reply.PayerId._text,
        payerEmail: reply.PayerEmail._text,
        payerStatus: reply.PayerStatus._text,
        payerName: {
          honorific: reply.PayerName.Honorific._text,
          firstName: reply.PayerName.FirstName._text,
          middleName: reply.PayerName.middleName._text,
          lastName: reply.PayerName.LastName._text
        },
        payerCountry: reply.PayerCountry._text,
        payerPhone: reply.PayerPhone._text,
        billingAddress: {
          line1: reply.BillingAddress.Line1._text,
          line2: reply.BillingAddress.Line2._text,
          line3: reply.BillingAddress.Line3._text,
          line4: reply.BillingAddress.Line4._text,
          city: reply.BillingAddress.City._text,
          mainDivision: reply.BillingAddress.MainDivison._text,
          countryCode: reply.BillingAddress.CountryCode._text,
          postalCode: reply.BillingAddress.PostalCode._text
        },
        shippingAddress: {
          line1: reply.BillingAddress.Line1._text,
          line2: reply.BillingAddress.Line2._text,
          line3: reply.BillingAddress.Line3._text,
          line4: reply.BillingAddress.Line4._text,
          city: reply.BillingAddress.City._text,
          mainDivision: reply.BillingAddress.MainDivison._text,
          countryCode: reply.BillingAddress.CountryCode._text,
          postalCode: reply.BillingAddress.PostalCode._text
        },
        shipToName: reply.ShipToName._text
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = GetExpress.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
