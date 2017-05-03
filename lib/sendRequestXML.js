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
        return fn(err);
      } else if (!response || !body) {
        return fn('Error - no response on request');
      }

      var jsonBody = xmlConvert.xml2js(body, {
        compact: true
      });

      if (jsonBody.Fault) {
        return fn(jsonBody.Fault.Description._text);
      } else if (response.statusCode !== 200) {
        return fn(jsonBody);
      }

      return fn(null, jsonBody);
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = SendRequest.request;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
