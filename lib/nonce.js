/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

const request = require('request');

/* CONSTRUCTOR */

(function () {

  var Nonce = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Nonce.get = function (fn) {
    var environment = params.environment;
    var nonceEndpoint = environment === 'development' ?
      'https://tst.payments.radial.com/hosted-payments/auth/nonce' :
      'https://hostedpayments.radial.com/hosted-payments/auth/nonce';

    request({
      url: nonceEndpoint,
      method: 'POST',
      body: {
        username: params.storeCode,
        password: params.apiKey
      },
      json: true
    }, function (err, response, body) {
      if (err) {
        return fn(err);
      } else if (!response || !body) {
        return fn('Error - no response on request');
      }

      if (response.statusCode !== 200 || body.error_code) {
        return fn(body.error_message);
      }

      return fn(null, {
        nonce: body.nonce,
        expiresInSeconds: body.expire_in_seconds
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Nonce.get;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
