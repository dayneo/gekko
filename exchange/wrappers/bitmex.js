const _ = require('lodash');
const moment = require('moment');
const Errors = require('../exchangeErrors');
const retry = require('../exchangeUtils');
const BitmexAPI = require('bitmex-node');

var Trader = function(config) {
  _.bindAll(this);
  if (_.isObject(config)) {
    this.key = config.key;
    this.secret = config.secret;
  }

  this.name = 'Bitmex';
  this.balance;
  this.price;
  this.asset = config.asset;
  this.currency = config.currency;
  this.pair = this.asset + this.currency;
  this.bitmex = new BitmexAPI({
    apiKeyID: 'NXTy391NCdhrrSWzsJE_xktb',
    apiKeySecret: 'bPVQ51-xxI7bRcuAAOlvH0wUFpPvusfmC1dF6zyy4s3v8Mgd',
  });
  this.interval = 4000;

  this.getCapabilities = function() {
    return {
      name: 'Bitmex',
      slug: 'bitmex',
      currencies: ['XBT', 'USD'],
      assets: ['XBT', 'ETH', 'BCH', 'XRP'],
      markets: [
        { pair: ['USD', 'XBT'], mimimalOrder: { amount: 1, unit: 'currency' } },
        {
          pair: ['XBT', 'XRP'],
          mimimalOrder: { amount: 0.00001, unit: 'currency' },
        },
      ],
      //requires: ['key', 'secret'],
      tid: 'tid',
      providesHistory: 'date', // this is supposed to make it importable
      tradable: true,
      gekkoBroker: '0.6',
    };
  };

  this.getTrades = (since, callback, descending) => {
    // bmsession.Quote.get()
    //   .then(quotes => callback(null, quotes))
    //   .catch(err => callback(err, []));

    const notImplementedError = { message: 'The function is not implemented.' };
    callback(notImplementedError, []);
  };
};

module.exports = Trader;
