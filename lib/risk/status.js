/* LIB */

const radial = require('../../radial');
const params = radial.getParams();
const utils = require('../utils');
const sendRequest = require('../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var OrderStatus = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  OrderStatus.get = function (options, fn) {
    const genericError = 'Error calling Risk/Fraud/OrderStatus - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    } else if (typeof options.orderId !== 'string' && typeof options.orderIdsList !== 'object') {
      return fn(genericError + '"orderId" must be provided in the request params as a string, or "orderIdsList" must be provided as an array.');
    }

    var storeParams = utils.getStoreParams(options.storeCode);
    var orderStatusUrl = storeParams.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + storeParams.storeCode +
      '/risk/fraud/orderStatus.xml';

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8',
          standalone: 'yes'
        }
      },
      RiskOrderStatusRequest: {
        _attributes: {
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
        },
        OrderIdsList: {
          OrderId: []
        }
      }
    };

    var idsList = postBodyJson.RiskOrderStatusRequest.OrderIdsList.OrderId;

    if (options.orderId) {
      idsList.push({
        _text: options.orderId.toString()
      });
    } else if (options.orderIdsList) {
      options.orderIdsList.forEach(function (orderId) {
        idsList.push({
          _text: orderId.toString()
        });
      });
    }

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });

    sendRequest({
      storeParams: storeParams,
      resource: orderStatusUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.RiskOrderStatusReply;
      var orderDetailsList = reply.OrderDetailsList.OrderDetails;

      if (orderDetailsList.length) {
        var orderDetails = [];
        orderDetailsList.forEach(function (order) {
          orderDetails.push({
            orderId: order.OrderId._text,
            riskOrderStatus: order.RiskOrderStatus._text
          });
        });

        return fn(null, {
          orderDetails: orderDetails
        });
      } else {
        return fn(null, {
          orderId: orderDetailsList.OrderId._text,
          riskOrderStatus: orderDetailsList.RiskOrderStatus._text
        });
      }
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = OrderStatus.get;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
