/* LIB */

const setExpress = require('./lib/paypal/setExpress');

/* CONSTRUCTOR */

(function () {

  var Radial = {};

  /* PRIVATE VARIABLES */

  var params;
  const defaults = {
    apiVersion: '1.0'
  };

  /* PUBLIC FUNCTIONS */

  Radial.setup = function (setupParams) {
    if (!setupParams) {
      throw new Error('Please include params for the Radial module constructor.');
    } else if (!setupParams.storeCode) {
      throw new Error('Missing "storeCode" in the Radial module params.');
    } else if (!setupParams.apiKey) {
      throw new Error('Missing "apiKey" in the Radial module params.');
    } else if (!setupParams.uriBaseDomain) {
      throw new Error('Missing "uriBaseDomain" in the Radial module params.');
    }

    params = setupParams;
    params.apiVersion = setupParams.apiVersion ? setupParams.apiVersion.toString() : defaults.apiVersion;

    return this;
  };

  Radial.setExpress = setExpress;

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Radial;
  } else {
    throw new Error('This module only works with NPM in NodeJS/IO.JS environments.');
  }

}());
