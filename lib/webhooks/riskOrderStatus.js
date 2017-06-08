/* LIB */

const radial = require('../../../radial');
const utils = require('../../utils');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var RiskOrderStatus = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC VARIABLES */

  /* PUBLIC FUNCTIONS */

  RiskOrderStatus.parse = function (req, fn) {
    var jsonBody = xmlConvert.xml2js(body, {
      compact: true
    });

    var reply = response.RiskAssessmentReplyList;
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = RiskOrderStatus.parse;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
