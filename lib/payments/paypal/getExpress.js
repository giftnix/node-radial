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
        payerEmail: reply.PayerEmail ? reply.PayerEmail._text : null,
        payerStatus: reply.PayerStatus ? reply.PayerStatus._text : null,
        payerName: {
          honorific: reply.PayerName.Honorific ? reply.PayerName._text : null,
          firstName: reply.PayerName.FirstName._text,
          middleName: reply.PayerName.middleName ? reply.PayerName._text : null,
          lastName: reply.PayerName.LastName._text
        },
        payerCountry: reply.PayerCountry ? reply.PayerCountry._text : null,
        payerPhone: reply.PayerPhone ? reply.PayerPhone._text : null,
        billingAddress: {
          line1: reply.BillingAddress && reply.BillingAddress.Line1 ?
            reply.BillingAddress.Line1._text : null,
          line2: reply.BillingAddress && reply.BillingAddress.Line2 ?
            reply.BillingAddress.Line2._text : null,
          line3: reply.BillingAddress && reply.BillingAddress.Line3 ?
            reply.BillingAddress.Line3._text : null,
          line4: reply.BillingAddress && reply.BillingAddress.Line4 ?
            reply.BillingAddress.Line4._text : null,
          city: reply.BillingAddress && reply.BillingAddress.City ?
            reply.BillingAddress.City._text : null,
          mainDivision: reply.BillingAddress && reply.BillingAddress.MainDivision ?
            reply.BillingAddress.MainDivision._text : null,
          countryCode: reply.BillingAddress && reply.BillingAddress.CountryCode ?
            reply.BillingAddress.CountryCode._text : null,
          postalCode: reply.BillingAddress && reply.BillingAddress.PostalCode ?
            reply.BillingAddress.PostalCode._text : null
        },
        shippingAddress: {
          line1: reply.ShippingAddress && reply.ShippingAddress.Line1 ?
            reply.ShippingAddress.Line1._text : null,
          line2: reply.ShippingAddress && reply.ShippingAddress.Line2 ?
            reply.ShippingAddress.Line2._text : null,
          line3: reply.ShippingAddress && reply.ShippingAddress.Line3 ?
            reply.ShippingAddress.Line3._text : null,
          line4: reply.ShippingAddress && reply.ShippingAddress.Line4 ?
            reply.ShippingAddress.Line4._text : null,
          city: reply.ShippingAddress && reply.ShippingAddress.City ?
            reply.ShippingAddress.City._text : null,
          mainDivision: reply.ShippingAddress && reply.ShippingAddress.MainDivision ?
            reply.ShippingAddress.MainDivision._text : null,
          countryCode: reply.ShippingAddress && reply.ShippingAddress.CountryCode ?
            reply.ShippingAddress.CountryCode._text : null,
          postalCode: reply.ShippingAddress && reply.ShippingAddress.PostalCode ?
            reply.ShippingAddress.PostalCode._text : null
        },
        paymentInfo: {
          financingApproved: reply.PaymentInfo && reply.PaymentInfo.FinancingApproved ?
            reply.PaymentInfo.FinancingApproved._text : null,
          financingFeeAmount: reply.PaymentInfo && reply.PaymentInfo.FinancingFeeAmount ?
            reply.PaymentInfo.FinancingFeeAmount._text : null,
          financingTerm: reply.PaymentInfo && reply.PaymentInfo.FinancingTerm ?
            reply.PaymentInfo.FinancingTerm._text : null,
          financingMonthlyPayment: reply.PaymentInfo && reply.PaymentInfo.FinancingMonthlyPayment ?
            reply.PaymentInfo.FinancingMonthlyPayment._text : null,
          financingTotalCost: reply.PaymentInfo && reply.PaymentInfo.FinancingTotalCost ?
            reply.PaymentInfo.FinancingTotalCost._text : null
        },
        cartChangeTolerance: reply.CartChangeTolerance ? reply.CartChangeTolerance : null,
        shipToName: reply.ShipToName ? reply.ShipToName._text : null
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
