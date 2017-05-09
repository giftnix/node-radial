/* LIB */

const radial = require('../../radial');
const utils = require('../utils');
const params = radial.getParams();

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
      Order: {
        CustomerList: {},
        ShippingList: {},
        LineItems: {},
        ExternalRiskResults: {},
        ShoppingSession: {},
        TotalCost: {
          FormOfPayment: {
            PaymentCard: {
              CardHolderName: {
                _text: ''
              },
              PaymentAccountUniqueId: {
                _attributes: {
                  isToken: ''
                },
                _text: ''
              },
              ExpireDate: {
                _text: ''
              },
              OrderAppId: {
                _text: ''
              },
              PaymentSessionId: {
                _text: ''
              },
              CardType: {
                _text: ''
              }
            },
            Email: {
              _text: ''
            },
            PersonName: {
              Honorific: {
                _text: ''
              },
              FirstName: {
                _text: ''
              },
              MiddleName: {
                _text: ''
              },
              LastName: {
                _text: ''
              },
              Suffix: {
                _text: ''
              }
            },
            Address: {
              _attributes: {
                AddressId: ''
              },
              Line1: {
                _text: ''
              },
              Line2: {
                _text: ''
              },
              Line3: {
                _text: ''
              },
              Line4: {
                _text: ''
              },
              City: {
                _text: ''
              },
              MainDivision: {
                _text: ''
              },
              CountryName: {
                _text: ''
              },
              CountryCode: {
                _text: ''
              }
            },
            Telephone: {
              Number: {
                _text: ''
              },
              TelephoneLocation: {
                _text: ''
              }
            },
            TransactionResponses: {
              TransactionResponse: [{
                _attributes: {
                  ResponseType: ''
                },
                _text: ''
              }]
            },
            PaymentTransactionDate: {
              _text: ''
            },
            PaymentTransactionTypeCode: {
              _text: ''
            },
            Amount: {
              _attributes: {
                currencyCode: ''
              },
              _text: ''
            },
            AccountID: {
              _attributes: {
                isToken: ''
              },
              _text: ''
            },
            TenderClass: {
              _text: ''
            }
          },
          CostTotals: {
            AmountBeforeTax: {
              _attributes: {
                currencyCode: ''
              },
              _text: ''
            },
            AmountAfterTax: {
              _attributes: {
                currencyCode: ''
              },
              _text: ''
            }
          },
          FailedCc: {
            _attributes: {
              Number: ''
            }
          }
        }
      },
      ServerInfo: {},
      DeviceInfo: {},
      CustomProperties: {}
    };

    if (options.promoCode) postBodyJson.PromoCode = {
      _text: options.promoCode
    };

    if (options.originalOrderId) postBodyJson.OriginalOrderId = {
      _text: options.originalOrderId
    };

    if (options.webOrderId) postBodyJson.WebOrderId = {
      _text: options.webOrderId
    };

    if (options.referenceOrderId) postBodyJson.ReferenceOrderId = {
      _text: options.referenceOrderId
    };

    if (options.orderCategory) postBodyJson.OrderCategory = {
      _text: options.orderCategory
    };

    if (options.orderModifiedBy) postBodyJson.OrderModifiedBy = {
      _text: options.orderModifiedBy
    };

    // GATHER CUSTOMERS LIST
    var customers = [];
    options.order.customerList.forEach(function (customer) {
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
            _text: customer.loyalty.signupDate
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
            _text: customer.loyalty.expireDate
          };
        }
        if (customer.loyalty.effectiveDate) {
          customerData.CustLoyalty.EffectiveDate = {
            _text: customer.loyalty.effectiveDate
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
            _text: customer.loyalty.lastLogin
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

    if (customers.length) postBodyJson.Order.CustomerList.Customer = customers;

    // GATHER SHIPMENTS LIST
    var shipments = [];
    options.order.shippingList.forEach(function (shipment) {
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
        shippingData.AmountBeforeTax = {
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

    if (shipments.length) postBodyJson.Order.ShippingList.Shipment = shipments;

    // GATHER LINE ITEMS
    var lineItems = [];
    options.order.lineItems.forEach(function (item) {
      var lineItemData = {
        _attributes: {
          LineItemId: options.lineItemId,
          ShipmentId: options.shipmentId
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

      if (item.productName) {
        lineItemData.ProductName = {
          _text: item.productName
        };
      }

      if (item.productDescription) {
        lineItemData.ProductDescription = {
          _text: item.productDescription
        };
      }

      if (item.weight) {
        lineItemData.UnitWeight = {
          _attributes: {
            unit: item.weightUnit
          },
          _text: item.weight.toString()
        };
      }

      if (item.productCategory) {
        lineItemData.ProductCategory = {
          _text: item.productCategory
        };
      }

      if (item.promoCode) {
        lineItemData.PromoCode = {
          _text: item.promoCode
        };
      }

      if (item.itemId) {
        lineItemData.ItemId = {
          _text: item.itemId
        };
      }

      lineItems.push(lineItemData);
    });

    if (lineItems.length) postBodyJson.Order.LineItems.LineItem = lineItems;

    // GATHER LINE ITEMS
    var externalRiskScores = [];
    options.order.externalRiskResults.forEach(function (external) {
      var riskData = {};

      if (external.score) {
        riskData.Score = {
          _text: external.score.toString()
        };
      }

      if (external.code) {
        riskData.Code = {
          _text: external.code
        };
      }

      if (external.source) {
        riskData.Source = {
          _text: external.source
        };
      }

      externalRiskScores.push(riskData);
    });

    if (externalRiskScores.length) postBodyJson.Order.ExternalRiskResults.ExternalRiskResult = externalRiskScores;

    if (options.shoppingSession) {
      if (options.shoppingSession.timeOnSite) {
        postBodyJson.Order.ShoppingSession.TimeOnSite = {
          _text: options.shoppingSession.timeOnSite
        };
      }
      if (options.shoppingSession.returnCustomer !== undefined) {
        postBodyJson.Order.ShoppingSession.ReturnCustomer = {
          _text: options.shoppingSession.returnCustomer.toString()
        };
      }
      if (options.shoppingSession.itemsRemoved !== undefined) {
        postBodyJson.Order.ShoppingSession.ItemsRemoved = {
          _text: options.shoppingSession.itemsRemoved.toString()
        };
      }
    }

    if (options.paymentCard) {
      if (!postBodyJson.Order.TotalCost) postBodyJson.Order.TotalCost = {
        FormOfPayment: {}
      };

    }

    // SERVER INFO
    postBodyJson.ServerInfo.Time = {
      _text: options.serverInfo.time
    };
    postBodyJson.ServerInfo.TZOffset = {
      _text: options.serverInfo.tzOffset
    };
    if (options.serverInfo.tzOffsetRaw) {
      postBodyJson.ServerInfo.TZOffsetRaw = {
        _text: options.serverInfo.time
      };
    }
    postBodyJson.ServerInfo.DSTActive = {
      _text: options.serverInfo.dstActive.toString()
    };

    // DEVICE INFO
    if (options.deviceInfo) {
      if (!postBodyJson.DeviceInfo) postBodyJson.DeviceInfo = {};

      if (options.deviceInfo.jsCollectorData) {
        postBodyJson.DeviceInfo.JSCData = {
          _text: options.deviceInfo.jsCollectorData
        };
      }
      if (options.deviceInfo.sessionId) {
        postBodyJson.DeviceInfo.SessionID = {
          _text: options.deviceInfo.sessionId
        };
      }
      if (options.deviceInfo.deviceIp) {
        postBodyJson.DeviceInfo.DeviceIP = {
          _text: options.deviceInfo.deviceIp
        };
      }
      if (options.deviceInfo.deviceHostname) {
        postBodyJson.DeviceInfo.DeviceHostname = {
          _text: options.deviceInfo.deviceHostname
        };
      }

      if (options.deviceInfo.httpHeaders) {
        postBodyJson.DeviceInfo.HttpHeaders = {
          HttpHeader: []
        };
        options.deviceInfo.httpHeaders.forEach(function (header) {
          postBodyJson.DeviceInfo.HttpHeaders.HttpHeader.push({
            _attributes: {
              name: header.name
            },
            _text: header.value
          });
        });
      }

      if (options.deviceInfo.userCookie) {
        postBodyJson.UserCookie = {
          _text: options.deviceInfo.userCookie
        };
      }
    }

    // CUSTOM PROPERTIES
    if (options.customPropertyGroups) {
      if (!postBodyJson.CustomProperties) postBodyJson.CustomProperties = {
        CustomPropertyGroup: []
      };

      options.customPropertyGroups.forEach(function (group) {
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
                _text: propertyValue
              };
            } else {
              propertyData.FloatValue = {
                _text: propertyValue
              };
            }
          } else if (typeof propertyValue === 'object') {
            propertyData.DateTimeValue = {
              _text: propertyValue
            };
          }

          groupData.CustomProperty.push(propertyData);
        });
      });
    }

    console.log(JSON.stringify(postBodyJson));

    var xmlBody = xmlConvert.js2xml(postBodyJson, {
      compact: true
    });
    console.log(xmlBody);
    return fn();

    // sendRequest({
    //   resource: assessUrl,
    //   method: 'POST',
    //   body: xmlBody
    // }, function (err, response) {
    //   if (err) return fn(err);
    //
    //   var reply = response.PayPalDoAuthorizationReply;
    //   if (reply.ResponseCode._text === 'Failure') {
    //     return fn(reply.ErrorMessage._text);
    //   }
    //
    //   return fn(null, response);
    // });
  };

  /* NPM EXPORT */

  if (typeof module === 'object' && module.exports) {
    module.exports = Assess.execute;
  } else {
    throw new Error('This module only works with NPM in NodeJS environments.');
  }

}());
