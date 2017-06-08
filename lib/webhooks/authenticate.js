/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

/* CONSTRUCTOR */

(function () {

  var Authenticate = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Authenticate.execute = function (route, req, fn) {
    var webhookAuth = params.webhooks[route];
    if (!webhookAuth || !webhookAuth.username || !webhookAuth.password) {
      return fn({
        message: 'Webhook authentication not provided to node-radial for endpoint ' + route
      });
    }
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Authenticate.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
