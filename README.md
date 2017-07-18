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

Alternately, you can pass the module an object with multiple store configurations, if you have multiple stores operating on Radial.

```
var radial = require('node-radial').configure({
  stores: [{
    storeCode: 'STORE1',
    customStoreCode: 'MyStore1', // OPTIONAL
    apiKey: '',
    uriBaseDomain: ''
  },{
    storeCode: 'STORE2',
    customStoreCode: 'MyStore2', // OPTIONAL
    apiKey: '',
    uriBaseDomain: ''
  }]
});
```

If you set up the module with multiple stores, each request to the module requires a `storeCode` to be passed in the request options. You can either pass the Radial defined store code, or the store code that you defined in the `customStoreCode` parameter during setup.

### Optional Setup Parameters

- `apiVersion` - API version as a numeric string **_defaults to '1.0'_**
- `environment` - Set to either `development` or `production` **_defaults to the value of `NODE_ENV` or `development` if not set_**
- `webhooks` - If you plan to use a webhook route, please pass an object with authentication data for each route. See the section on [Webhooks](#webhooks) for details on setting this up.

## Tokenization and 3D Secure

<https://docs.ptf.radial.com/Content/Topics/payments/payment-3ds-tokenization.htm>

### Get a Nonce

```
radial.nonce(function(err, response) {
  /*
  response = {
    nonce: '1a83cd28-3847-4a41-8c52-48cc5ab1af61',
    expiresInSeconds: 1000
  };
});
```

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
    token: 'EC-5YE59312K56892714',
    redirectUrl: 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-5YE59312K56892714'
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
      pendingReason: 'Order',
      reasonCode: '12345'
    }
  };
  */
});
```

### PayPal DoAuthorization

The final API in PayPal checkout flow. See the following reference for details.

<https://docs.ptf.radial.com/Content/Topics/payments/paypal-do-authorization.htm>

```
radial.paypal.doAuthorization({
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
    authorizationInfo: {
      paymentStatus: 'Pending',
      pendingReason: 'authorization',
      reasonCode: '1234'
    }
  };
  */
});
```

### Payment Settlement

When you are ready to capture funds from the customer's form of payment.

PLEASE NOTE. None of the `invoiceData` in the schema for this API is completed. It seems uncommon to include this data in the request, so I didn't waste my time with it. If you need it, start a pull request!

This module will determine whether to send a `PaymentContext` or a `PaymentContextBase` based on the presents of `accountUniqueId`.

<https://docs.ptf.radial.com/Content/Topics/events/events-payment-settlement.htm>

```
radial.payments.settlement.create({
  paymentContext: { // REQUIRED
    orderId: '', // REQUIRED
    accountUniqueId: '',
    accountUniqueIdIstoken: false
  },
  invoiceId: '', // REQUIRED
  currencyCode: 'USD', // REQUIRED
  amount: 12.34, // REQUIRED
  taxAmount: 1.18, // REQUIRED
  settlementType: 'Debit', // REQUIRED ("Debit" or "Credit")
  authorizationResponseCode: '',
  authorizationDate: new Date(),
  expirationDate: new Date(),
  clientContext: '',
  finalDebit: false,
  omsOrderId: '',
  billingAddress: {
    line1: '', // REQUIRED
    line2: '',
    line3: '',
    line4: '',
    city: '', // REQUIRED
    mainDivision: '',
    countryCode: '', // REQUIRED
    postalCode: ''
  },
  personName: {
    honorific: '',
    firstName: '',
    middleName: '',
    lastName: '' // REQUIRED
  }
}, function(err, response) {
  /*
  response = {
    received: true
  };
  */
});
```

## Fraud Management Processing

### Risk Assessment

This API has a lot of intricacies, with lengthy and complex requirements and optional parameters. Please refer to the Radial documentation to know what is required, and the type of data needed for the API. Because of the API's complexity and wide possibility space, `node-radial` does very little to error check for you. It simply maps your block of JSON data to Radial's required XML data. Below is an example with all possible parameters entered.

<https://docs.ptf.radial.com/Content/Topics/risk/risk-assessment-api.htm>

```
RADIAL.risk.assess({
  order: { // REQUIRED
    orderId: '123456', // REQUIRED
    promoCode: '$1 Off Returning Customer',
    originalOrderId: '123-456',
    webOrderId: '123-456',
    referenceOrderId: '1234567890',
    orderCategory: 'MODIFIED',
    orderModifiedBy: 'John Doe',
    customerList: [{ // REQUIRED
      personName: { // REQUIRED
        honorific: 'Mr',
        firstName: 'John', // REQUIRED
        middleName: 'Smith',
        lastName: 'Doe', // REQUIRED
        suffix: 'Sr'
      },
      email: 'johndoe12345@gmail.com',
      telephone: {
        number: '4805551212', // REQUIRED
        location: 'Home'
      },
      address: {
        id: 'BID-201703261515496410804517', // REQUIRED
        line1: '123 Test St', // REQUIRED
        line2: 'BLANK',
        line3: 'BLANK',
        lin4: 'BLANK',
        buildingName: 'BLANK',
        poBox: 'BLANK',
        city: 'Austin', // REQUIRED
        mainDivision: 'TX',
        countryName: 'United States',
        countryCode: 'USA', // REQUIRED
        postalCode: '78759'
      },
      memberLoggedIn: true, // REQUIRED
      loyalty: {
        totalPoints: 12,
        status: 'Active',
        signupDate: new Date(),
        remark: 'BLANK',
        programId: '12345',
        membershipId: '98765', // REQUIRED
        userId: '56789',
        loyalLevel: 'Gold',
        expireDate: new Date(),
        effectiveDate: new Date(),
        currentPoints: 10,
        vendorCode: 'MyRewards',
        clubStatus: 'Active',
        memberLoggedIn: true, // REQUIRED
        lastLogin: new Date(),
        userTenure: 94,
        userPassword: '012394asjdfkasjdf902394u12394',
        failedLoginAttempts: 2
      },
      currencyCode: 'USD' // REQUIRED
    }],
    shippingList: [{
      addressId: '1234', // REQUIRED
      shipmentId: '1234', // REQUIRED
      currencyCode: 'USD', // REQUIRED
      amountBeforeTax: 12.34,
      amountAfterTax: 13.36, // REQUIRED
      shippingMethod: 'UPS Ground' // REQUIRED
    }],
    lineItems: [{
      id: '1234', // REQUIRED
      shipmentId: '1234', // REQUIRED
      totalAmount: 12.34, // REQUIRED
      unitCostAmount: 12.34,
      currencyCode: 'USD', // REQUIRED
      quantity: 1, // REQUIRED
      productName: 'Graphic T-Shirt',
      productDescription: 'BLANK',
      weight: 2,
      weightUnit: 'pound',
      productCategory: 'Shirts',
      promoCode: 'BLANK',
      itemId: '123495912304kasd0f23'
    }],
    externalRiskResults: [{
      score: 0.2,
      code: 'Low Risk',
      source: 'MyFraudBudy'
    }],
    shoppingSession: {
      timeOnSite: 8.12,
      returnCustomer: true,
      itemsRemoved: true
    },
    paymentCard: {
      cardHolderName: 'John Doe', // REQUIRED
      paymentAccountUniqueIdIsToken: false, // REQUIRED
      paymentAccountUniqueId: 'JUDDXBXXXXXXA', // REQUIRED
      expireDate: new Date(),
      orderAppiId: 'BLANK',
      paymentSessionId: '0006302964495',
      gatewayKey: 'BLANK',
      cardType: 'Visa'
    },
    payment: {
      authorization: {
        decline: false, // REQUIRED
        code: 'BLANK'
      },
      email: 'johndoe12345@gmail.com',
      personName: {
        honorific: 'Mr',
        firstName: 'John', // REQUIRED
        middleName: 'Smith',
        lastName: 'Doe', // REQUIRED
        suffix: 'Sr'
      },
      address: {
        id: 'BID-201703261515496410804517', // REQUIRED
        line1: '123 Test St', // REQUIRED
        line2: 'BLANK',
        line3: 'BLANK',
        lin4: 'BLANK',
        buildingName: 'BLANK',
        poBox: 'BLANK',
        city: 'Austin', // REQUIRED
        mainDivision: 'TX',
        countryName: 'United States',
        countryCode: 'USA', // REQUIRED
        postalCode: '78759'
      },
      telephone: {
        number: '4805551212', // REQUIRED
        location: 'Home'
      },
      transactionResponses: [{
        type: 'PayPalPayer', // REQUIRED
        response: 'verified' // REQUIRED
      }],
      paymentTransactionDate: new Date(), // REQUIRED
      paymentTransactionTypeCode: 'PY', // REQUIRED
      currencyCode: 'USD', // REQUIRED
      amount: 12.34, // REQUIRED
      accountIdIsToken: true,
      accountId: 'JUDDXBXXXXXXA',
      tenderClass: 'BLANK' // REQUIRED
    },
    costTotals: { // REQUIRED
      currencyCode: 'USD', // REQUIRED
      amountBeforeTax: 12.34,
      amountAfterTax: 12.34 // REQUIRED
    },
    failedCcNumber: 0
  },
  serverInfo: { // REQUIRED
    time: new Date(), // REQUIRED
    tzOffset: '-6', // REQUIRED
    tzOffsetRaw: '-6',
    dstActive: true // REQUIRED
  },
  deviceInfo: {
    jsCollectorData: '0349123jf9dslkfj934j123r8jfdy8f98dhaf9asdf',
    sessionId: '0349123asdfas0-3-4192df',
    deviceIp: '10.0.0.1',
    deviceHostname: 'www.giftnix.com',
    httpHeaders: [{
      name: 'accept-language', // REQUIRED
      value: 'en-us'
    }],
    userCookie: '%5BCookies+id%3D639672634%5D'
  },
  customPropertyGroups: [{
    groupName: 'BLANK', // REQUIRED
    properties: [{ // REQUIRED
      name: 'A STRING', // REQUIRED
      value: 'string value' // String, Number, or Date - REQUIRED
    }, { // REQUIRED
      name: 'A NUMBER', // REQUIRED
      value: 42 // String, Number, or Date - REQUIRED
    }, { // REQUIRED
      name: 'A DATE', // REQUIRED
      value: new Date() // String, Number, or Date - REQUIRED
    }]
  }]
}, function (err, response) {
  /*
  response = {
    responseCode: 'Success',
    orderId: '123-456',
    mockOrderEvent: false,
    storeId: 'YOURSTORE',
    reasonCode: '',
    reasonCodeDescription: ''
  };
  */
});
```

## Webhooks

The webhooks part of this API wrapper is PROBABLY NOT READY FOR PRIMETIME yet. I can't guarantee that it's going to work.

### Config

When you configure Radial, include webhook authorization info for any endpoints you plan to use.

```
var radial = require('node-radial').configure({
  // ...
  webhooks: {
    paymentAuthCancel: {
      username: '',
      password: ''
    },
    paymentSettlementStatus: {
      username: '',
      password: ''
    },
    riskOrderStatus: {
      username: '',
      password: ''
    }
  }
});
```

### Risk Order Status

At your webhook endpoint, pass the request object to authorize and parse the message.

```
router.post('v1/webhooks/radial/risk-order-status', function (req, res, next) {
  radial.webhooks.riskOrderStatus(req, function(err, data) {
    if (err) {
      // send Radial a 400 or 500 so that they can retry the request
      return res.status(err.status).send(err.type + ': ' + err.message);
    }
    // send a 200 so that Radial will clear the event
    return res.send('Order risk status received.');
  });
});
```

### Payment Settlement Status

Radial's settlement API is asynchronous, so you will have to set up a webhook endpoint to receive the status of a settlement.

```
router.post('v1/webhooks/radial/payment-settlement-status', function (req, res, next) {
  radial.webhooks.paymentSettlementStatus(req, function(err, data) {
    if (err) {
      // send Radial a 400 or 500 so that they can retry the request
      return res.status(err.status).send(err.type + ': ' + err.message);
    }
    // send a 200 so that Radial will clear the event
    return res.send('Payment settlement status received.');
  });
});
```

## CHANGELOG

- **0.3.6:** Improve response handling for risk assessment webhook.
- **0.3.5:** Adding payment settlement status webhook endpoint. Webhooks are still not quite ready to go.
- **0.3.4:** Fix bad reference on webhook response.
- **0.3.3:** Path fixes.
- **0.3.2:** Working on webhook authentication.
- **0.3.1:** Path fixes.
- **0.3.0:** Working on body parser. Not fully working yet.
- **0.2.4:** Logging cleanup.
- **0.2.3:** `ItemListRPH` was missing from the fraud assessment request. The module now generates this string automatically from the item list.
- **0.2.2:** Fixes to risk assessment handling of external risk results, payment amount, and server timezone offset.
- **0.2.1:** Fixes to risk assessment XML request and API response.
- **0.2.0:** Allows you to set up multiple stores in configuration.
- **0.1.5:** Implemented risk assessment API endpoint. It's largely untested and prone to lots of bugs.
- **0.1.4:** Fixes for PayPal doAuthorization endpoint.
- **0.1.3:** Add method to get a nonce for use with Radial's JavaScript library. SetExpress returns a `redirectUrl` in addition to the raw token. Finalize doExpress method.
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
