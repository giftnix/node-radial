/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

const request = require('request');
const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var SendRequest = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  SendRequest.request = function (options, fn) {
    var requestOptions = {
      url: options.resource,
      method: options.method,
      headers: {
        'Content-Type': 'text/xml',
        'ApiKey': params.apiKey
      },
      body: options.body,
      qs: options.qs
    };

    request(requestOptions, function (err, response, body) {
      if (err) {
        return fn('Error on request: ' + err);
      } else if (!response || !body) {
        return fn('Error - no response on request');
      }

      var jsonBody = xmlConvert.xml2js(body, {
        compact: true
      });
      var reply = jsonBody.PayPalSetExpressCheckoutReply;

      if (response.statusCode !== 200) {
        return fn(reply);
      } else if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        token: reply.Token._text
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = SendRequest.request;
  } else {
    throw new Error('This module only works with NPM in NodeJS/IO.JS environments.');
  }

}());
