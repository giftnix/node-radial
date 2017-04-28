[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# Radial API for NodeJS

A NodeJS wrapper for the Radial Payments & Fraud REST APIs.

Install via npm:

```
npm install --save node-radial
```

## API Setup

Require the module and call `configure()`:

```
var radial = require('node-radial').configure({
  storeCode: '',
  apiKey: ''
});
```

### Optional Setup Parameters

- `version` - API version as a numeric string **_defaults to '1.0'_**

## CHANGELOG

- **0.1.0:** Initial release.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/giftnix/radial/blob/master/LICENSE
[npm-downloads-image]: http://img.shields.io/npm/dm/node-radial.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-radial
[npm-version-image]: http://img.shields.io/npm/v/node-radial.svg?style=flat-square
[travis-image]: http://img.shields.io/travis/giftnix/node-radial.svg?style=flat-square
[travis-url]: http://travis-ci.org/giftnix/node-radial
