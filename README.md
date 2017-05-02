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
  apiKey: '',
  uriBaseDomain: ''
});
```

### Optional Setup Parameters

- `apiVersion` - API version as a numeric string **_defaults to '1.0'_**

## PayPal Processing

### PayPal SetExpress

The first API in PayPal checkout flow. See the following reference for details.

<https://docs.ptf.radial.com/Content/Topics/payments/paypal-set-express.htm>

```
var lineItems = [{
  name: 'Cool Product',
  quantity: 2,
  amount: 9.99
}];

radial.paypal.setExpress({
  orderId: '12345',
  returnUrl: '',
  cancelUrl: '',
  localeCode: 'en_US',
  currencyCode: 'USD',
  addressOverride: 0, // optional
  noShippingAddressDisplay: 1, // optional
  shipToName: 'John Doe', // optional
  shippingAddress: { // optional
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      city: '',
      mainDivision: '',
      countryCode: '',
      postalCode: ''
  },
  shippingTotal: 2.00,
  taxTotal: 1.23,
  lineItems: lineItems,
  installment: false, // optional
  recurring: false // optional
}, function(err, response) {
  /*
  response = {
    responseCode: 'Success',
    orderId: '12345',
    token: 'EC-5YE59312K56892714'
  };
  */
});
```

### PayPal GetExpress

The second API in PayPal checkout flow. See the following reference for details.

<https://docs.ptf.radial.com/Content/Topics/payments/paypal-get-express.htm>

```
radial.paypal.getExpress({
  orderId: '12345',
  token: 'EC-5YE59312K56892714',
  currencyCode: 'USD'
}, function(err, response) {
  /*
  response = {
    responseCode: 'Success',
    orderId: '12345',
    payerId: '',
    payerEmail: '',
    payerStatus: '',
    payerName: {
      honorific: '',
      firstName: '',
      middleName: '',
      lastName: ''
    },
    payerCountry: '',
    payerPhone: '',
    billingAddress: {
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      city: '',
      mainDivision: '',
      countryCode: '',
      postalCode: ''
    },
    shippingAddress: {
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      city: '',
      mainDivision: '',
      countryCode: '',
      postalCode: ''
    },
    shipToName: ''
  }
  */
});
```

### PayPal DoExpress

The third API in PayPal checkout flow. See the following reference for details.

<https://docs.ptf.radial.com/Content/Topics/payments/paypal-do-express.htm>

```
var lineItems = [{
  name: 'Cool Product',
  quantity: 2,
  amount: 9.99
}];

radial.paypal.doExpress({
  orderId: '12345',
  token: '',
  currencyCode: 'USD',
  pickUpStoreId: 'StoreName StoreNumber', // optional
  shipToName: 'John Doe', // optional
  shippingAddress: { // optional
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      city: '',
      mainDivision: '',
      countryCode: '',
      postalCode: ''
  },
  shippingTotal: 2.00,
  taxTotal: 1.23,
  lineItems: lineItems,
  recurring: false, // optional
  requestId: '1234567'
}, function(err, response) {
  /*
  response = {
    responseCode: 'Success',
    orderId: '12345',
    transactionId: 'O-3A919253XG323924A',
    paymentInfo: {
      paymentStatus: 'Pending',
      paymentReason: 'Order',
      paymentCode: '12345'
    }
  };
  */
});
```

### PayPal DoAuthorization

The final API in PayPal checkout flow. See the following reference for details.

<https://docs.ptf.radial.com/Content/Topics/payments/paypal-do-authorization.htm>

```
radial.paypal.doExpress({
  orderId: '12345',
  amount: 23.21,
  currencyCode: 'USD',
  requestId: '1234567'
}, function(err, response) {
  /*
  response = {
    responseCode: 'Success',
    orderId: '12345',
    transactionId: 'O-3A919253XG323924A',
    paymentInfo: {
      paymentStatus: 'Pending',
      paymentReason: 'Authorization',
      paymentCode: '1234'
    }
  };
  */
});
```

## CHANGELOG

- **0.1.2:** Add PayPal doExpress and doAuthorization endpoints.
- **0.1.1:** Add PayPal getExpress endpoint and generalize the sendRequest lib.
- **0.1.0:** Initial release. Only PayPal setExpress is available so far.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/giftnix/radial/blob/master/LICENSE
[npm-downloads-image]: http://img.shields.io/npm/dm/node-radial.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-radial
[npm-version-image]: http://img.shields.io/npm/v/node-radial.svg?style=flat-square
[travis-image]: http://img.shields.io/travis/giftnix/node-radial.svg?style=flat-square
[travis-url]: http://travis-ci.org/giftnix/node-radial
