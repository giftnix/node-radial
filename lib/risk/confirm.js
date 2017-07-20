/* LIB */

const radial = require('../../radial');
const params = radial.getParams();
const utils = require('../utils');
const sendRequest = require('../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var OrderConfirmation = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  OrderConfirmation.execute = function (options, fn) {
    const genericError = 'Error calling Risk/Fraud/OrderConfirmation - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.orderId !== 'string') {
      return fn(genericError + '"orderId" must be provided in the request params as a string.');
    } else if (typeof options.statusDate !== 'object') {
      return fn(genericError + '"statusDate" must be provided in the request params as a date.');
    } else if (typeof options.confirmationType !== 'string') {
      return fn(genericError + '"confirmationType" must be provided in the request params as a string.');
    } else if (typeof options.orderStatus !== 'string') {
      return fn(genericError + '"orderStatus" must be provided in the request params as a string.');
    }

    var storeParams = utils.getStoreParams(options.storeCode);
    var orderConfirmationUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
      '/risk/fraud/orderConfirmation.xml';

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8',
          standalone: 'yes'
        }
      },
      RiskOrderConfirmationRequest: {
        _attributes: {
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
        },
        Order: {
          OrderId: {
            _text: options.orderId
          },
          StoreId: {
            _text: storeParams.storeCode
          },
          StatusDate: {
            _text: options.statusDate.toISOString()
          },
          ConfirmationType: {
            _text: options.confirmationType
          },
          OrderStatus: {
            _text: options.orderStatus
          }
        }
      }
    };

    var orderRequest = postBodyJson.RiskOrderConfirmationRequest.Order;

    if (options.orderStatusReason) {
      orderRequest.OrderStatusReason = {
        _text: options.orderStatusReason
      };
    }

    // LINE ITEM DETAILS
    if (options.lineDetails) {
      var details = [];

      options.lineDetails.forEach(function (item) {
        var detail = {};

        if (item.SKU) {
          detail.SKU = {
            _text: item.SKU
          };
        }

        if (item.quantity) {
          detail.Quantity = {
            _text: item.quantity.toString()
          };
        }

        if (item.itemStatus) {
          detail.ItemStatus = {
            _text: item.itemStatus
          };
        }

        if (item.trackingNumber) {
          detail.TrackingNumber = {
            _text: item.trackingNumber
          };
        }

        if (item.shippingVendorCode) {
          detail.ShippingVendorCode = {
            _text: item.shippingVendorCode
          };
        }

        if (item.deliveryMethod) {
          detail.DeliveryMethod = {
            _text: item.deliveryMethod
          };
        }

        if (item.shipScheduledDate) {
          detail.ShipScheduledDate = {
            _text: item.shipScheduledDate.toISOString()
          };
        }

        if (item.shipActualDate) {
          detail.ShipActualDate = {
            _text: item.shipActualDate.toISOString()
          };
        }

        details.push(detail);
      });

      orderRequest.LineDetails = {
        LineDetail: details
      };
    }

    if (options.customAttributes) {
      var attributes = [];

      for (var name in options.customAttributes) {
        attributes.push({
          AttributeName: {
            _text: name
          },
          AttributeValue: {
            _text: options.customAttributes[name]
          }
        });
      }

      orderRequest.CustomAttributesList = {
        CustomAttribute: attributes
      };
    }

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });

    sendRequest({
      storeParams: storeParams,
      resource: orderConfirmationUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.RiskOrderConfirmationReply;

      return fn(null, {
        orderId: reply.OrderId._text,
        storeCode: reply.StoreId._text,
        createTimestamp: reply.CreateTimestamp ?
          new Date(reply.CreateTimestamp._text) : null,
        orderConfirmationAcknowledgement: reply.OrderConfirmationAcknowledgement ?
          reply.OrderConfirmationAcknowledgement._text === 'true' : null
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = OrderConfirmation.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
