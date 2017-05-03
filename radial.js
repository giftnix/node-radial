/* LIB */

/* CONSTRUCTOR */

(function () {

  var Radial = {};

  /* PRIVATE VARIABLES */

  var params;
  const defaults = {
    apiVersion: '1.0',
    environment: process.env.NODE_ENV || 'development'
  };

  /* PUBLIC FUNCTIONS */

  Radial.configure = function (configParams) {
    if (!configParams) {
      throw new Error('Please include params for the Radial module constructor.');
    } else if (!configParams.storeCode) {
      throw new Error('Missing "storeCode" in the Radial module params.');
    } else if (!configParams.apiKey) {
      throw new Error('Missing "apiKey" in the Radial module params.');
    } else if (!configParams.uriBaseDomain) {
      throw new Error('Missing "uriBaseDomain" in the Radial module params.');
    }

    params = configParams;
    params.apiVersion = configParams.apiVersion ? configParams.apiVersion.toString() : defaults.apiVersion;
    params.environment = configParams.environment ? configParams.environment : defaults.environment;
    Radial.params = params;

    Radial.nonce = require('./lib/nonce');
    Radial.creditCard = require('./lib/payments/creditCard/index');
    Radial.paypal = require('./lib/payments/paypal/index');

    return this;
  };

  Radial.getParams = function () {
    return Radial.params;
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Radial;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
