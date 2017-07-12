/* LIB */

const radial = require('../../../radial');
const params = radial.getParams();
const utils = radial.utils;
const sendRequest = require('../../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var SetExpress = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  SetExpress.execute = function (options, fn) {
    const genericError = 'Error calling PayPal setExpress - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.orderId !== 'string') {
      return fn(genericError + '"orderId" must be provided in the request params as a string.');
    } else if (typeof options.returnUrl !== 'string') {
      return fn(genericError + '"returnUrl" must be provided in the request params as a string.');
    } else if (typeof options.cancelUrl !== 'string') {
      return fn(genericError + '"cancelUrl" must be provided in the request params as a string.');
    } else if (typeof options.localeCode !== 'string') {
      return fn(genericError + '"localeCode" must be provided in the request params as a string.');
    } else if (typeof options.currencyCode !== 'string') {
      return fn(genericError + '"currencyCode" must be provided in the request params as a string.');
    } else if (typeof options.shippingTotal !== 'number') {
      return fn(genericError + '"shippingTotal" must be provided in the request params as a number.');
    } else if (typeof options.taxTotal !== 'number') {
      return fn(genericError + '"taxTotal" must be provided in the request params as a number.');
    } else if (typeof options.lineItems !== 'object') {
      return fn(genericError + '"lineItems" must be provided in the request params as an array.');
    } else if (typeof options.installment !== 'boolean') {
      return fn(genericError + '"installment" must be provided in the request params as a boolean.');
    } else if (typeof options.recurring !== 'boolean') {
      return fn(genericError + '"recurring" must be provided in the request params as a boolean.');
    }

    var storeParams = utils.getStoreParams(options.storeCode);
    var setExpressUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
      '/payments/paypal/setExpress.xml';

    var lineItemsXml = [{
      type: 'element',
      name: 'ShippingTotal',
      attributes: {
        currencyCode: options.currencyCode
      },
      elements: [{
        type: 'text',
        text: options.shippingTotal.toFixed(2)
      }]
    }, {
      type: 'element',
      name: 'TaxTotal',
      attributes: {
        currencyCode: options.currencyCode
      },
      elements: [{
        type: 'text',
        text: options.taxTotal.toFixed(2)
      }]
    }];

    var lineItemsTotal = 0;
    options.lineItems.forEach(function (lineItem, index) {
      var lineItemAmount = parseFloat(lineItem.amount);
      var lineItemQuantity = parseInt(lineItem.quantity);
      lineItemsTotal += (lineItemAmount * lineItemQuantity);

      lineItemsXml.push({
        type: 'element',
        name: 'LineItem',
        elements: [{
          type: 'element',
          name: 'Name',
          elements: [{
            type: 'text',
            text: lineItem.name
          }]
        }, {
          type: 'element',
          name: 'SequenceNumber',
          elements: [{
            type: 'text',
            text: (index + 1).toString()
          }]
        }, {
          type: 'element',
          name: 'Quantity',
          elements: [{
            type: 'text',
            text: lineItemQuantity.toString()
          }]
        }, {
          type: 'element',
          name: 'UnitAmount',
          attributes: {
            currencyCode: options.currencyCode
          },
          elements: [{
            type: 'text',
            text: lineItemAmount.toFixed(2)
          }]
        }]
      });
    });

    lineItemsXml = [{
      type: 'element',
      name: 'LineItemsTotal',
      attributes: {
        currencyCode: options.currencyCode
      },
      elements: [{
        type: 'text',
        text: lineItemsTotal.toFixed(2)
      }]
    }].concat(lineItemsXml);

    var totalString =
      (parseFloat(lineItemsTotal) + parseFloat(options.shippingTotal) + parseFloat(options.taxTotal)).toFixed(2);

    var recurring, installment;
    if (options.recurring === true) {
      recurring = 'true';
    } else {
      recurring = 'false';
    }
    if (options.installment === true) {
      installment = 'true';
    } else {
      installment = 'false';
    }

    var postBodyJson = {
      declaration: {
        attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      elements: [{
        type: 'element',
        name: 'PayPalSetExpressCheckoutRequest',
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
          name: 'ReturnUrl',
          elements: [{
            type: 'text',
            text: options.returnUrl
          }]
        }, {
          type: 'element',
          name: 'CancelUrl',
          elements: [{
            type: 'text',
            text: options.cancelUrl
          }]
        }, {
          type: 'element',
          name: 'LocaleCode',
          elements: [{
            type: 'text',
            text: options.localeCode
          }]
        }, {
          type: 'element',
          name: 'Amount',
          attributes: {
            currencyCode: options.currencyCode
          },
          elements: [{
            type: 'text',
            text: totalString
          }]
        }, {
          type: 'element',
          name: 'AddressOverride',
          elements: [{
            type: 'text',
            text: options.addressOverride !== undefined ?
              options.addressOverride.toString() : '0'
          }]
        }, {
          type: 'element',
          name: 'NoShippingAddressDisplay',
          elements: [{
            type: 'text',
            text: options.noShippingAddressDisplay !== undefined ?
              options.addressOverride.toString() : '0'
          }]
        }]
      }]
    };

    if (options.shipToName && typeof options.shipToName === 'string') {
      postBodyJson.elements[0].elements.push({
        type: 'element',
        name: 'ShipToName',
        elements: [{
          type: 'text',
          text: options.shipToName
        }]
      });
    }

    if (options.shippingAddress && typeof options.shippingAddress === 'object') {
      var shippingAddressElements = [{
        type: 'element',
        name: 'Line1',
        elements: [{
          type: 'text',
          text: options.shippingAddress.line1
        }]
      }];

      if (options.shippingAddress.line2) {
        shippingAddressElements.push({
          type: 'element',
          name: 'Line2',
          elements: [{
            type: 'text',
            text: options.shippingAddress.line2
          }]
        });
      }
      if (options.shippingAddress.line3) {
        shippingAddressElements.push({
          type: 'element',
          name: 'Line3',
          elements: [{
            type: 'text',
            text: options.shippingAddress.line3
          }]
        });
      }
      if (options.shippingAddress.line4) {
        shippingAddressElements.push({
          type: 'element',
          name: 'Line4',
          elements: [{
            type: 'text',
            text: options.shippingAddress.line4
          }]
        });
      }

      shippingAddressElements = shippingAddressElements.concat([{
        type: 'element',
        name: 'City',
        elements: [{
          type: 'text',
          text: options.shippingAddress.city
        }]
      }, {
        type: 'element',
        name: 'MainDivision',
        elements: [{
          type: 'text',
          text: options.shippingAddress.mainDivision
        }]
      }, {
        type: 'element',
        name: 'CountryCode',
        elements: [{
          type: 'text',
          text: options.shippingAddress.countryCode
        }]
      }, {
        type: 'element',
        name: 'PostalCode',
        elements: [{
          type: 'text',
          text: options.shippingAddress.postalCode
        }]
      }]);

      postBodyJson.elements[0].elements.push({
        type: 'element',
        name: 'ShippingAddress',
        elements: shippingAddressElements
      });
    }

    postBodyJson.elements[0].elements = postBodyJson.elements[0].elements.concat([{
      type: 'element',
      name: 'LineItems',
      elements: lineItemsXml
    }, {
      type: 'element',
      name: 'Recurring',
      elements: [{
        type: 'text',
        text: recurring
      }]
    }, {
      type: 'element',
      name: 'Installment',
      elements: [{
        type: 'text',
        text: installment
      }]
    }, {
      type: 'element',
      name: 'SchemaVersion',
      elements: [{
        type: 'text',
        text: '1.2'
      }]
    }]);

    var xmlBody = xmlConvert.js2xml(postBodyJson);

    sendRequest({
      storeParams: storeParams,
      resource: setExpressUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.PayPalSetExpressCheckoutReply;
      if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      var token = reply.Token._text;
      var redirectUrl = 'https://';
      if (params.environment === 'development') {
        redirectUrl +=
          'sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + token;
      } else {
        redirectUrl +=
          'www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + token;
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        token: token,
        redirectUrl: redirectUrl
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = SetExpress.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
