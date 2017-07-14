/* LIB */

const radial = require('../../radial');
const params = radial.getParams();

/* MODULES */

/* CONSTRUCTOR */

(function () {

  var Authenticate = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Authenticate.execute = function (route, req, fn) {
    const webhookAuth = params.webhooks[route];
    if (!webhookAuth || !webhookAuth.username || !webhookAuth.password) {
      return fn({
        message: 'Webhook authentication not provided to node-radial for endpoint ' + route
      });
    }

    var username = req.headers.username;
    var password = req.headers.password;

    if (username === webhookAuth.username && password === webhookAuth.password) {
      return fn();
    } else {
      return fn({
        message: 'Invalid username or password'
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
