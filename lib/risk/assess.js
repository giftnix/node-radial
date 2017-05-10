/* LIB */

const radial = require('../../radial');
const utils = require('../utils');
const params = radial.getParams();
const sendRequest = require('../sendRequestXML');

/* MODULES */

const xmlConvert = require('xml-js');

/* CONSTRUCTOR */

(function () {

  var Assess = {};

  /* PRIVATE VARIABLES */

  /* PUBLIC FUNCTIONS */

  Assess.execute = function (options, fn) {
    // you are on your own with this API
    // there are so many possible fields here
    // that there's only so much I can do with this wrapper
    const genericError = 'Error calling Fraud Risk Assessment - ';
    if (!options || typeof options !== 'object') {
      throw new Error(genericError + 'no params object provided.');
    } else if (!fn || typeof fn !== 'function') {
      throw new Error(genericError + 'no callback function provided.');
    }

    var assessUrl = params.uriBaseDomain + '/v' + params.apiVersion + '/stores/' + params.storeCode +
      '/risk/fraud/assess.xml';

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      RiskAssessmentRequest: {
        _attributes: {
          xmlns: 'http://api.gsicommerce.com/schema/checkout/1.0'
        },
        Order: {
          CustomerList: {},
          ShippingList: {},
          LineItems: {},
          ExternalRiskResults: {},
          ShoppingSession: {},
          TotalCost: {}
        },
        ServerInfo: {}
      }
    };

    var assessmentRequest = postBodyJson.RiskAssessmentRequest;
    var requestOrder = assessmentRequest.Order;

    var orderOptions = options.order;
    var paymentCardOptions = options.paymentCard;
    var serverInfoOptions = options.serverInfo;
    var deviceInfoOptions = options.deviceInfo;
    var customPropertyGroupsOptions = options.customPropertyGroups;

    if (orderOptions.promoCode) requestOrder.PromoCode = {
      _text: orderOptions.promoCode
    };
    if (orderOptions.originalOrderId) requestOrder.OriginalOrderId = {
      _text: orderOptions.originalOrderId
    };
    if (orderOptions.webOrderId) requestOrder.WebOrderId = {
      _text: orderOptions.webOrderId
    };
    if (orderOptions.referenceOrderId) requestOrder.ReferenceOrderId = {
      _text: orderOptions.referenceOrderId
    };
    if (orderOptions.orderCategory) requestOrder.OrderCategory = {
      _text: orderOptions.orderCategory
    };
    if (orderOptions.orderModifiedBy) requestOrder.OrderModifiedBy = {
      _text: orderOptions.orderModifiedBy
    };

    // GATHER CUSTOMERS LIST
    var customers = [];
    orderOptions.customerList.forEach(function (customer) {
      var customerData = {};

      // NAME
      if (customer.personName) {
        customerData.PersonName = {};
        if (customer.personName.honorific) customerData.PersonName.Honorific = {
          _text: customer.personName.honorific
        };
        if (customer.personName.firstName) customerData.PersonName.FirstName = {
          _text: customer.personName.firstName
        };
        if (customer.personName.middleName) customerData.PersonName.MiddleName = {
          _text: customer.personName.middleName
        };
        if (customer.personName.lastName) customerData.PersonName.LastName = {
          _text: customer.personName.lastName
        };
        if (customer.personName.suffix) customerData.PersonName.Suffix = {
          _text: customer.personName.suffix
        };
      }

      // EMAIL
      if (customer.email) customerData.Email = {
        _text: customer.email
      };

      // TELEPHONE
      if (customer.telephone) {
        customerData.Telephone = {};
        if (customer.telephone.number) customerData.Telephone.Number = {
          _text: customer.telephone.number
        };
        if (customer.telephone.location) customerData.Telephone.TelephoneLocation = {
          _text: customer.telephone.location
        };
      }

      // ADDRESS
      if (customer.address) {
        customerData.Address = {
          _attributes: {
            AddressId: customer.address.id
          }
        };

        if (customer.address.line1) customerData.Address.Line1 = {
          _text: customer.address.line1
        };
        if (customer.address.line2) customerData.Address.Line2 = {
          _text: customer.address.line2
        };
        if (customer.address.line3) customerData.Address.Line3 = {
          _text: customer.address.line3
        };
        if (customer.address.line4) customerData.Address.Line4 = {
          _text: customer.address.line4
        };
        if (customer.address.buildingName) customerData.Address.BuildingName = {
          _text: customer.address.buildingName
        };
        if (customer.address.poBox) customerData.Address.PoBox = {
          _text: customer.address.poBox
        };
        if (customer.address.city) customerData.Address.City = {
          _text: customer.address.city
        };
        if (customer.address.mainDivision) customerData.Address.MainDivision = {
          _text: customer.address.mainDivision
        };
        if (customer.address.countryName) customerData.Address.CountryName = {
          _text: customer.address.countryName
        };
        if (customer.address.countryCode) customerData.Address.CountryCode = {
          _text: customer.address.countryCode
        };
        if (customer.address.postalCode) customerData.Address.PostalCode = {
          _text: customer.address.postalCode
        };
      }

      // LOGGED IN
      if (customer.memberLoggedIn !== undefined) {
        customerData.MemberLoggedIn = {
          _text: customer.memberLoggedIn.toString()
        };
      }

      // LOYALTY PROGRAM
      if (customer.loyalty) {
        customerData.CustLoyalty = {};

        if (customer.loyalty.totalPoints) {
          customerData.CustLoyalty.TotalPoints = {
            _text: customer.loyalty.totalPoints.toString()
          };
        }
        if (customer.loyalty.status) {
          customerData.CustLoyalty.Status = {
            _text: customer.loyalty.status
          };
        }
        if (customer.loyalty.signupDate) {
          customerData.CustLoyalty.SignupDate = {
            _text: customer.loyalty.signupDate.toISOString()
          };
        }
        if (customer.loyalty.remark) {
          customerData.CustLoyalty.Remark = {
            _text: customer.loyalty.remark
          };
        }
        if (customer.loyalty.programId) {
          customerData.CustLoyalty.ProgramID = {
            _text: customer.loyalty.programId
          };
        }
        if (customer.loyalty.membershipId) {
          customerData.CustLoyalty.MembershipID = {
            _text: customer.loyalty.membershipId
          };
        }
        if (customer.loyalty.userId) {
          customerData.CustLoyalty.UserId = {
            _text: customer.loyalty.userId
          };
        }
        if (customer.loyalty.loyalLevel) {
          customerData.CustLoyalty.LoyalLevel = {
            _text: customer.loyalty.loyalLevel
          };
        }
        if (customer.loyalty.expireDate) {
          customerData.CustLoyalty.ExpireDate = {
            _text: customer.loyalty.expireDate.toISOString()
          };
        }
        if (customer.loyalty.effectiveDate) {
          customerData.CustLoyalty.EffectiveDate = {
            _text: customer.loyalty.effectiveDate.toISOString()
          };
        }
        if (customer.loyalty.currentPoints) {
          customerData.CustLoyalty.CurrentPoints = {
            _text: customer.loyalty.currentPoints.toString()
          };
        }
        if (customer.loyalty.vendorCode) {
          customerData.CustLoyalty.VendorCode = {
            _text: customer.loyalty.vendorCode
          };
        }
        if (customer.loyalty.clubStatus) {
          customerData.CustLoyalty.ClubStatus = {
            _text: customer.loyalty.clubStatus
          };
        }
        if (customer.loyalty.memberLoggedIn !== undefined) {
          customerData.CustLoyalty.MemberLoggedIn = {
            _text: customer.loyalty.memberLoggedIn.toString()
          };
        }
        if (customer.loyalty.lastLogin) {
          customerData.CustLoyalty.LastLogin = {
            _text: customer.loyalty.lastLogin.toISOString()
          };
        }
        if (customer.loyalty.userTenure) {
          customerData.CustLoyalty.UserTenure = {
            _text: customer.loyalty.userTenure.toString()
          };
        }
        if (customer.loyalty.userPassword) {
          customerData.CustLoyalty.UserPassword = {
            _text: customer.loyalty.userPassword
          };
        }
        if (customer.loyalty.failedLoginAttempts) {
          customerData.CustLoyalty.FailedLoginAttempts = {
            _text: customer.loyalty.failedLoginAttempts.toFixed(0)
          };
        }
      }

      // CURRENCY CODE
      if (customer.currencyCode) {
        customerData.CurrencyCode = {
          _text: customer.currencyCode
        };
      }

      customers.push(customerData);
    });

    if (customers.length) requestOrder.CustomerList.Customer = customers;

    // GATHER SHIPMENTS LIST
    var shipments = [];
    orderOptions.shippingList.forEach(function (shipment) {
      var shippingData = {
        _attributes: {
          AddressId: shipment.addressId,
          ShipmentId: shipment.shipmentId
        },
        CostTotals: {
          AmountAfterTax: {
            _attributes: {
              currencyCode: shipment.currencyCode
            },
            _text: shipment.amountAfterTax.toFixed(2)
          }
        }
      };

      if (shipment.amountBeforeTax) {
        shippingData.CostTotals.AmountBeforeTax = {
          _attributes: {
            currencyCode: shipment.currencyCode
          },
          _text: shipment.amountBeforeTax.toFixed(2)
        };
      }

      if (shipment.shippingMethod) {
        shippingData.ShippingMethod = {
          _text: shipment.shippingMethod
        };
      }

      shipments.push(shippingData);
    });

    if (shipments.length) requestOrder.ShippingList.Shipment = shipments;

    // GATHER LINE ITEMS
    var lineItems = [];
    orderOptions.lineItems.forEach(function (item) {
      var lineItemData = {
        _attributes: {
          LineItemId: item.id,
          ShipmentId: item.shipmentId
        }
      };

      lineItemData.LineTotalAmount = {
        _attributes: {
          currencyCode: item.currencyCode
        },
        _text: item.totalAmount.toFixed(2)
      };

      if (item.unitCostAmount) {
        lineItemData.UnitCostAmount = {
          _attributes: {
            currencyCode: item.currencyCode
          },
          _text: item.unitCostAmount.toFixed(2)
        };
      }

      lineItemData.Quantity = {
        _text: item.quantity.toString()
      };

      if (item.productName) lineItemData.ProductName = {
        _text: item.productName
      };

      if (item.productDescription) lineItemData.ProductDescription = {
        _text: item.productDescription
      };

      if (item.weight) lineItemData.UnitWeight = {
        _attributes: {
          unit: item.weightUnit
        },
        _text: item.weight.toString()
      };

      if (item.productCategory) lineItemData.ProductCategory = {
        _text: item.productCategory
      };

      if (item.promoCode) lineItemData.PromoCode = {
        _text: item.promoCode
      };

      if (item.itemId) lineItemData.ItemId = {
        _text: item.itemId
      };

      lineItems.push(lineItemData);
    });

    if (lineItems.length) requestOrder.LineItems.LineItem = lineItems;

    // GATHER LINE ITEMS
    var externalRiskScores = [];
    orderOptions.externalRiskResults.forEach(function (external) {
      var riskData = {};

      if (external.score) riskData.Score = {
        _text: external.score.toString()
      };
      if (external.code) riskData.Code = {
        _text: external.code
      };
      if (external.source) riskData.Source = {
        _text: external.source
      };

      externalRiskScores.push(riskData);
    });

    if (externalRiskScores.length) requestOrder.ExternalRiskResults.ExternalRiskResult =
      externalRiskScores;

    if (orderOptions.shoppingSession) {
      if (orderOptions.shoppingSession.timeOnSite) requestOrder.ShoppingSession.TimeOnSite = {
        _text: orderOptions.shoppingSession.timeOnSite.toString()
      };
      if (orderOptions.shoppingSession.returnCustomer !== undefined) requestOrder.ShoppingSession
        .ReturnCustomer = {
          _text: orderOptions.shoppingSession.returnCustomer.toString()
        };
      if (orderOptions.shoppingSession.itemsRemoved !== undefined) requestOrder.ShoppingSession
        .ItemsRemoved = {
          _text: orderOptions.shoppingSession.itemsRemoved.toString()
        };
    }

    // PAYMENT INFO AND TOTALS
    if (paymentCardOptions || orderOptions.payment || orderOptions.costTotals) {
      requestOrder.TotalCost = {};
    }
    if (paymentCardOptions || orderOptions.payment) {
      requestOrder.TotalCost.FormOfPayment = {};
    }

    if (paymentCardOptions) {
      var paymentCardData = {
        CardHolderName: {
          _text: paymentCardOptions.cardHolderName
        },
        PaymentAccountUniqueId: {
          _attributes: {
            isToken: paymentCardOptions.paymentAccountUniqueIdIsToken.toString()
          },
          _text: paymentCardOptions.paymentAccountUniqueId
        }
      };

      if (paymentCardOptions.expireDate) paymentCardData.ExpireDate = {
        _text: paymentCardOptions.expireDate.toISOString()
      };
      if (paymentCardOptions.orderAppId) paymentCardData.OrderAppId = {
        _text: paymentCardOptions.orderAppId
      };
      if (paymentCardOptions.paymentSessionId) paymentCardData.PaymentSessionId = {
        _text: paymentCardOptions.paymentSessionId
      };
      if (paymentCardOptions.gatewayKey) paymentCardData.GatewayKey = {
        _text: paymentCardOptions.gatewayKey
      };
      if (paymentCardOptions.cardType) paymentCardData.CardType = {
        _text: paymentCardOptions.cardType
      };

      requestOrder.TotalCost.FormOfPayment.PaymentCard = paymentCardData;
    }

    if (orderOptions.payment) {
      if (orderOptions.payment.authorization) {
        var authorizationData = {
          Decline: {
            _text: orderOptions.payment.authorization.decline.toString()
          }
        };

        if (orderOptions.payment.authorization.code) authorizationData.Code = {
          _text: orderOptions.payment.authorization.code
        };

        requestOrder.TotalCost.FormOfPayment.Authorization = authorizationData;
      }

      if (orderOptions.payment.email) requestOrder.TotalCost.FormOfPayment.Email = {
        _text: orderOptions.payment.email
      };

      // PAYMENT PERSON NAME
      if (orderOptions.payment.personName) {
        var personNameData = {};
        if (orderOptions.payment.personName.honorific) personNameData.Honorific = {
          _text: orderOptions.payment.personName.honorific
        };
        if (orderOptions.payment.personName.firstName) personNameData.FirstName = {
          _text: orderOptions.payment.personName.firstName
        };
        if (orderOptions.payment.personName.middleName) personNameData.MiddleName = {
          _text: orderOptions.payment.personName.middleName
        };
        if (orderOptions.payment.personName.lastName) personNameData.LastName = {
          _text: orderOptions.payment.personName.lastName
        };
        if (orderOptions.payment.personName.suffix) personNameData.Suffix = {
          _text: orderOptions.payment.personName.suffix
        };

        requestOrder.TotalCost.FormOfPayment.PersonName = personNameData;
      }

      // PAYMENT ADDRESS
      if (orderOptions.payment.address) {
        var addressData = {
          _attributes: {
            AddressId: orderOptions.payment.address.id
          }
        };

        if (orderOptions.payment.address.line1) addressData.Line1 = {
          _text: orderOptions.payment.address.line1
        };
        if (orderOptions.payment.address.line2) addressData.Line2 = {
          _text: orderOptions.payment.address.line2
        };
        if (orderOptions.payment.address.line3) addressData.Line3 = {
          _text: orderOptions.payment.address.line3
        };
        if (orderOptions.payment.address.line4) addressData.Line4 = {
          _text: orderOptions.payment.address.line4
        };
        if (orderOptions.payment.address.buildingName) addressData.BuildingName = {
          _text: orderOptions.payment.address.buildingName
        };
        if (orderOptions.payment.address.poBox) addressData.PoBox = {
          _text: orderOptions.payment.address.poBox
        };
        if (orderOptions.payment.address.city) addressData.City = {
          _text: orderOptions.payment.address.city
        };
        if (orderOptions.payment.address.mainDivision) addressData.MainDivision = {
          _text: orderOptions.payment.address.mainDivision
        };
        if (orderOptions.payment.address.countryName) addressData.CountryName = {
          _text: orderOptions.payment.address.countryName
        };
        if (orderOptions.payment.address.countryCode) addressData.CountryCode = {
          _text: orderOptions.payment.address.countryCode
        };
        if (orderOptions.payment.address.postalCode) addressData.PostalCode = {
          _text: orderOptions.payment.address.postalCode
        };

        requestOrder.TotalCost.FormOfPayment.Address = addressData;
      }

      // PAYMENT TELEPHONE
      if (orderOptions.payment.telephone) {
        var telephoneData = {
          Number: {
            _text: orderOptions.payment.telephone.number
          }
        };
        if (orderOptions.payment.telephone.location) telephoneData.TelephoneLocation = {
          _text: orderOptions.payment.telephone.location
        };

        requestOrder.TotalCost.FormOfPayment.Telephone = telephoneData;
      }

      // PAYMENT TRANSACTION RESPONSES
      if (orderOptions.payment.transactionResponses) {
        var transactionResponses = [];
        orderOptions.payment.transactionResponses.forEach(function (response) {
          transactionResponses.push({
            _attributes: {
              ResponseType: response.type
            },
            _text: response.response
          });
        });

        requestOrder.TotalCost.FormOfPayment.TransactionResponses = {
          TransactionResponse: transactionResponses
        };
      }

      if (orderOptions.payment.paymentTransactionDate) requestOrder.TotalCost.FormOfPayment.PaymentTransactionDate = {
        _text: orderOptions.payment.paymentTransactionDate.toISOString()
      };

      if (orderOptions.payment.paymentTransactionTypeCode) requestOrder.TotalCost.FormOfPayment.PaymentTransactionTypeCode = {
        _text: orderOptions.payment.paymentTransactionTypeCode
      };

      // PURCHASE AMOUNT
      requestOrder.TotalCost.FormOfPayment.Amount = {
        _attributes: {
          currencyCode: orderOptions.payment.currencyCode
        },
        _text: orderOptions.payment.amount.toFixed(2)
      };

      if (orderOptions.payment.accountId) requestOrder.TotalCost.FormOfPayment.AccountID = {
        _attributes: {
          isToken: orderOptions.payment.accountIdIsToken.toString()
        },
        _text: orderOptions.payment.accountId
      };

      if (orderOptions.payment.tenderClass) requestOrder.TotalCost.FormOfPayment.TenderClass = {
        _text: orderOptions.payment.tenderClass
      };
    }

    // COST TOTALS
    var costTotalsData = {};
    if (orderOptions.costTotals.amountBeforeTax) {
      costTotalsData.AmountBeforeTax = {
        _attributes: {
          currencyCode: orderOptions.costTotals.currencyCode
        },
        _text: orderOptions.costTotals.amountBeforeTax.toFixed(2)
      };
    }

    costTotalsData.AmountAfterTax = {
      _attributes: {
        currencyCode: orderOptions.costTotals.currencyCode
      },
      _text: orderOptions.costTotals.amountAfterTax.toFixed(2)
    };

    requestOrder.TotalCost.CostTotals = costTotalsData;

    // FAILED CC
    if (orderOptions.failedCcNumber) {
      requestOrder.TotalCost.FailedCc = {
        _attributes: {
          Number: orderOptions.failedCcNumber.toString()
        }
      };
    }

    // SERVER INFO
    assessmentRequest.ServerInfo.Time = {
      _text: serverInfoOptions.time.toISOString()
    };
    assessmentRequest.ServerInfo.TZOffset = {
      _text: serverInfoOptions.tzOffset
    };
    if (serverInfoOptions.tzOffsetRaw) {
      assessmentRequest.ServerInfo.TZOffsetRaw = {
        _text: serverInfoOptions.tzOffsetRaw
      };
    }
    assessmentRequest.ServerInfo.DSTActive = {
      _text: serverInfoOptions.dstActive.toString()
    };

    // DEVICE INFO
    if (deviceInfoOptions) {
      if (!assessmentRequest.DeviceInfo) assessmentRequest.DeviceInfo = {};

      if (deviceInfoOptions.jsCollectorData) assessmentRequest.DeviceInfo.JSCData = {
        _text: deviceInfoOptions.jsCollectorData
      };
      if (deviceInfoOptions.sessionId) assessmentRequest.DeviceInfo.SessionID = {
        _text: deviceInfoOptions.sessionId
      };
      if (deviceInfoOptions.deviceIp) assessmentRequest.DeviceInfo.DeviceIP = {
        _text: deviceInfoOptions.deviceIp
      };
      if (deviceInfoOptions.deviceHostname) assessmentRequest.DeviceInfo.DeviceHostname = {
        _text: deviceInfoOptions.deviceHostname
      };

      if (deviceInfoOptions.httpHeaders) {
        assessmentRequest.DeviceInfo.HttpHeaders = {
          HttpHeader: []
        };
        deviceInfoOptions.httpHeaders.forEach(function (header) {
          assessmentRequest.DeviceInfo.HttpHeaders.HttpHeader.push({
            _attributes: {
              name: header.name
            },
            _text: header.value
          });
        });
      }

      if (deviceInfoOptions.userCookie) assessmentRequest.DeviceInfo.UserCookie = {
        _text: deviceInfoOptions.userCookie
      };
    }

    // CUSTOM PROPERTIES
    if (customPropertyGroupsOptions) {
      if (!assessmentRequest.CustomProperties) assessmentRequest.CustomProperties = {
        CustomPropertyGroup: []
      };

      customPropertyGroupsOptions.forEach(function (group) {
        var groupData = {
          _attributes: {
            Name: group.groupName
          },
          CustomProperty: []
        };
        group.properties.forEach(function (property) {
          var propertyData = {
            _attributes: {
              Name: property.name
            }
          };

          var propertyValue = property.value;
          if (typeof propertyValue === 'string') {
            propertyData.StringValue = {
              _text: propertyValue
            };
          } else if (typeof propertyValue === 'number') {
            var isInteger = utils.isInteger(propertyValue);
            if (isInteger === true) {
              propertyData.IntegerValue = {
                _text: propertyValue.toString()
              };
            } else {
              propertyData.FloatValue = {
                _text: propertyValue.toString()
              };
            }
          } else if (typeof propertyValue === 'object') {
            propertyData.DateTimeValue = {
              _text: propertyValue.toISOString()
            };
          }

          groupData.CustomProperty.push(propertyData);
        });

        assessmentRequest.CustomProperties.CustomPropertyGroup.push(groupData);
      });
    }

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });

    sendRequest({
      resource: assessUrl,
      method: 'POST',
      body: xmlBody
    }, function (err, response) {
      if (err) return fn(err);

      var reply = response.RiskAssessmentReply;
      if (reply.ResponseCode._text === 'Failure') {
        return fn(reply.ErrorMessage._text);
      }

      return fn(null, {
        responseCode: reply.ResponseCode._text,
        orderId: reply.OrderId._text,
        mockOrderEvent: reply.MockOrderEvent._text,
        storeId: reply.StoreId._text,
        reasonCode: reply.ReasonCode._text,
        reasonCodeDescription: reply.ReasonCodeDescription._text
      });
    });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Assess.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
