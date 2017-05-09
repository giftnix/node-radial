/* LIB */

const radial = require('../../radial');
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
    options.customerList.forEach(function (customer) {
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
        _text: customer.suffix
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
      if (customer.memberLoggedIn === false) {
        customerData.MemberLoggedIn = {
          _text: 'false'
        };
      } else {
        customerData.MemberLoggedIn = {
          _text: 'true'
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
        if (customer.loyalty.memberLoggedIn) {
          customerData.CustLoyalty.MemberLoggedIn = {
            _text: customer.loyalty.memberLoggedIn
          };
        }
        if (customer.loyalty.lastLogin) {
          customerData.CustLoyalty.LastLogin = {
            _text: customer.loyalty.lastLogin
          };
        }
        if (customer.loyalty.userTenure) {
          customerData.CustLoyalty.UserTenure = {
            _text: customer.loyalty.userTenure
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

    postBodyJson.Order.CustomerList.Customer = customers;

    // GATHER SHIPMENTS LIST

    var shipments = [];
    options.shippingList.forEach(function (shipment) {
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

    postBodyJson.Order.ShippingList.Shipment = shipments;

    // GATHER LINE ITEMS

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
        LineItems: {
          LineItem: [{
            _attributes: {
              LineItemId: '',
              ShipmentId: ''
            },
            LineItemTotal: {
              _attributes: {
                currencyCode: ''
              },
              _text: ''
            },
            UnitCostAmount: {
              _attributes: {
                currencyCode: ''
              },
              _text: ''
            },
            Quantity: {
              _text: ''
            },
            ProductName: {
              _text: ''
            },
            ProductDescription: {
              _text: ''
            },
            UnitWeight: {
              _attributes: {
                unit: ''
              },
              _text: ''
            },
            ItemId: {
              _text: ''
            }
          }]
        },
        ExternalRiskResults: {
          ExternalRiskResult: [{
            Code: {
              _text: ''
            },
            Source: {
              _text: ''
            }
          }]
        },
        ShoppingSession: {
          TimeOnSite: {
            _text: ''
          },
          ReturnCustomer: {
            _text: ''
          },
          ItemsRemoved: {
            _text: ''
          }
        },
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
      serverInfo: {
        Time: {
          _text: ''
        },
        TZOffset: {
          _text: ''
        },
        DSTActive: {
          _text: ''
        }
      },
      deviceInfo: {
        JSCData: {
          _text: ''
        },
        SessionID: {
          _text: ''
        },
        DeviceIP: {
          _text: ''
        },
        DeviceHostname: {
          _text: ''
        },
        HttpHeaders: {
          HttpHeader: [{
            _attributes: {
              name: ''
            },
            _text: ''
          }]
        },
        UserCookie: {
          _text: ''
        }
      },
      CustomProperties: {
        CustomerPropertyGroup: [{
          _attributes: {
            Name: ''
          },
          CustomProperty: {
            _attributes: {
              Name: ''
            },
            StringValue: {
              _text: ''
            }
          }
        }]
      }
    };

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
