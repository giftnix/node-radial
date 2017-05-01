/* LIB */

/* MODULES */

const request = require('request');

/* CONSTRUCTOR */

(function () {

  var SendRequest = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  SendRequest.request = function (options, fn) {
    var requestOptions = {
      uri: options.resource,
      method: options.method,
      headers: headers,
      qs: options.qs,
      timeout: params.timeout,
      json: true
    };

    if (options.fields) {
      options.fields = queryString.stringify(options.fields);
      if (options.method === 'POST' || options.method === 'PUT') {
        requestOptions.body = options.fields;
      }
    }

    request(requestOptions, function (err, response, body) {
      if (err) {
        return fn('Error on request: ' + err);
      } else if (!response || !body) {
        return fn('Error - no response on request');
      } else if (response.statusCode !== 200) {
        return fn(body);
      } else if (response.errors && response.errors.length > 0) {
        return fn(body);
      }
      return fn(null, body);
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = SendRequest;
  } else {
    throw new Error('This module only works with NPM in NodeJS/IO.JS environments.');
  }

}());
