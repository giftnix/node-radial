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
    if (!configParams || typeof configParams !== 'object') {
      throw new Error('Please include params for the Radial module constructor.');
    }

    // accept either params for one store, or an array of store params
    var stores = [];

    if (configParams.stores) {
      configParams.stores.forEach((storeParams) => {
        var code = storeParams.customStoreCode ?
          storeParams.customStoreCode : storeParams.storeCode;
        stores.push(storeParams);
      });
    } else {
      var code = configParams.customStoreCode ?
        configParams.customStoreCode : configParams.storeCode;
      stores.push(configParams);
    }

    // set the singleton params object
    params = {
      stores: stores,
      apiVersion: configParams.apiVersion ? configParams.apiVersion.toString() : defaults.apiVersion,
      environment: configParams.environment ? configParams.environment : defaults.environment
    };

    if (configParams.webhooks) params.webhooks = configParams.webhooks;

    Radial.params = params;

    Radial.nonce = require('./lib/nonce');
    Radial.creditCard = require('./lib/payments/creditCard/index');
    Radial.paypal = require('./lib/payments/paypal/index');
    Radial.risk = require('./lib/risk/index');
    Radial.webhooks = require('./lib/webhooks/index');
    Radial.utils = require('./lib/utils');

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
