/* LIB */

const radial = require('../radial');
const params = radial.getParams();

/* MODULES */

const xmlConvert = require('xml-js');

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

  Utils.bodyParser = function () {
    return xmlBodyParser;

    function xmlBodyParser(req, res, next) {
      var data = '';

      if (req._body) return next();

      req.body = req.body || {};

      if (!hasBody(req) || !module.exports.regexp.test(mime(req))) {
        return next();
      }

      req._body = true;

      req.setEncoding('utf-8');
      req.on('data', function (chunk) {
        data += chunk;
      });

      req.on('end', function () {
        // invalid xml, length required
        if (data.trim().length === 0) {
          return next(error(411));
        }
        var jsonBody = xmlConvert.xml2js(body, {
          compact: true
        });
        req.body = jsonBody || req.body;
        req.rawBody = data;
        return next();
      });
    }
  };

  /* HELPERS */

  function hasBody(req) {
    var encoding = 'transfer-encoding' in req.headers;
    var length = 'content-length' in req.headers && req.headers['content-length'] !== '0';
    return encoding || length;
  }

  function mime(req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
  }

  function error(code, msg) {
    var err = new Error(msg || http.STATUS_CODES[code]);
    err.status = code;
    return err;
  }

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Utils;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
