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

    var postBodyJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'utf-8'
        }
      },
      Order: {
        OrderId: {
          _text: ''
        },
        OrderCategory: {
          _text: ''
        },
        CustomerList: {
          Customer: [{
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
            Telephone: {
              Number: {
                _text: ''
              },
              TelephoneLocation: {
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
            MemberLoggedIn: {
              _text: ''
            },
            CustLoyalty: {
              MembershipId: {
                _text: ''
              },
              UserId: {
                _text: ''
              },
              MemberLoggedIn: {
                _text: ''
              }
            }
          }]
        },
        ShippingList: {
          Shipment: [{
            _attributes: {
              AddressId: '',
              ShipmentId: ''
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
            }
          }]
        },
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
                unit = ''
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
