/* LIB */

const radial = require('../../../radial');
const params = radial.getParams();
const utils = require('../../utils');
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

    var storeParams = utils.getStoreParams(options.storeCode);
    var getExpressUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
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
      storeParams: storeParams,
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
        payerEmail: reply.PayerEmail ? reply.PayerEmail._text : undefined,
        payerStatus: reply.PayerStatus ? reply.PayerStatus._text : undefined,
        payerName: {
          honorific: reply.PayerName.Honorific ? reply.PayerName._text : undefined,
          firstName: reply.PayerName.FirstName._text,
          middleName: reply.PayerName.middleName ? reply.PayerName._text : undefined,
          lastName: reply.PayerName.LastName._text
        },
        payerCountry: reply.PayerCountry ? reply.PayerCountry._text : undefined,
        payerPhone: reply.PayerPhone ? reply.PayerPhone._text : undefined,
        billingAddress: {
          line1: reply.BillingAddress && reply.BillingAddress.Line1 ?
            reply.BillingAddress.Line1._text : undefined,
          line2: reply.BillingAddress && reply.BillingAddress.Line2 ?
            reply.BillingAddress.Line2._text : undefined,
          line3: reply.BillingAddress && reply.BillingAddress.Line3 ?
            reply.BillingAddress.Line3._text : undefined,
          line4: reply.BillingAddress && reply.BillingAddress.Line4 ?
            reply.BillingAddress.Line4._text : undefined,
          city: reply.BillingAddress && reply.BillingAddress.City ?
            reply.BillingAddress.City._text : undefined,
          mainDivision: reply.BillingAddress && reply.BillingAddress.MainDivision ?
            reply.BillingAddress.MainDivision._text : undefined,
          countryCode: reply.BillingAddress && reply.BillingAddress.CountryCode ?
            reply.BillingAddress.CountryCode._text : undefined,
          postalCode: reply.BillingAddress && reply.BillingAddress.PostalCode ?
            reply.BillingAddress.PostalCode._text : undefined
        },
        shippingAddress: {
          line1: reply.ShippingAddress && reply.ShippingAddress.Line1 ?
            reply.ShippingAddress.Line1._text : undefined,
          line2: reply.ShippingAddress && reply.ShippingAddress.Line2 ?
            reply.ShippingAddress.Line2._text : undefined,
          line3: reply.ShippingAddress && reply.ShippingAddress.Line3 ?
            reply.ShippingAddress.Line3._text : undefined,
          line4: reply.ShippingAddress && reply.ShippingAddress.Line4 ?
            reply.ShippingAddress.Line4._text : undefined,
          city: reply.ShippingAddress && reply.ShippingAddress.City ?
            reply.ShippingAddress.City._text : undefined,
          mainDivision: reply.ShippingAddress && reply.ShippingAddress.MainDivision ?
            reply.ShippingAddress.MainDivision._text : undefined,
          countryCode: reply.ShippingAddress && reply.ShippingAddress.CountryCode ?
            reply.ShippingAddress.CountryCode._text : undefined,
          postalCode: reply.ShippingAddress && reply.ShippingAddress.PostalCode ?
            reply.ShippingAddress.PostalCode._text : undefined
        },
        paymentInfo: {
          financingApproved: reply.PaymentInfo && reply.PaymentInfo.FinancingApproved ?
            reply.PaymentInfo.FinancingApproved._text : undefined,
          financingFeeAmount: reply.PaymentInfo && reply.PaymentInfo.FinancingFeeAmount ?
            reply.PaymentInfo.FinancingFeeAmount._text : undefined,
          financingTerm: reply.PaymentInfo && reply.PaymentInfo.FinancingTerm ?
            reply.PaymentInfo.FinancingTerm._text : undefined,
          financingMonthlyPayment: reply.PaymentInfo && reply.PaymentInfo.FinancingMonthlyPayment ?
            reply.PaymentInfo.FinancingMonthlyPayment._text : undefined,
          financingTotalCost: reply.PaymentInfo && reply.PaymentInfo.FinancingTotalCost ?
            reply.PaymentInfo.FinancingTotalCost._text : undefined
        },
        cartChangeTolerance: reply.CartChangeTolerance ? reply.CartChangeTolerance : undefined,
        shipToName: reply.ShipToName ? reply.ShipToName._text : undefined
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
