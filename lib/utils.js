/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

/* CONSTRUCTOR */

(function () {

  var Utils = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Utils.isInteger = function (n) {
    return parseInt(n) === n;
  };

  Utils.getStoreParams = function (storeCode) {
    if (storeCode === undefined && params.stores.length > 1) {
      throw new Error('Request options must include a "storeCode" since you configured more than one store.');
    } else if (params.stores.length === 1) {
      return params.stores[1];
    }
    return params.stores.find(function (store) {
      return store.storeCode === storeCode || store.customStoreCode === storeCode;
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Utils;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
