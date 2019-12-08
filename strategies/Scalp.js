// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');

var EMA = require('./indicators/EMA.js');
var RSI = require('./indicators/RSI.js');

// Let's create our own strat
var strat = {};

strat.buy = function(candle) {
  this.advice('long');
  this.target = candle.close * this.longPerc;
  this.stop = candle.close * this.stopLoss;
  log.debug('buy at %s (%s < hold > %s)', candle.close, this.stop, this.target);
}

strat.sell = function(candle) {
  this.advice('short');
  this.target = null;
  this.stop = null;
  log.debug('sell at %s', candle.close);
}

// Prepare everything our method needs
strat.init = function() {
  this.name = 'dayneo - Scalp strategy';
  this.input = 'candle';
  this.requiredHistory = this.tradingAdvisor.historySize;

  this.longPerc = 1 + this.settings.limit; 
  this.stopLoss = 1 - this.settings.stopLoss;
  this.target = null;
  this.stop = null;
  //this.tradeAgainst = this.settings.tradeAgainst; // true/false
  this.emas = [];

  // define the indicators we need
  this.addIndicator('ema', 'EMA', this.settings.ema.interval); // 14 intervals
  this.addIndicator('rsi', 'RSI', this.settings.rsa);
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  let rsi = this.indicators.rsi;

  let ema = this.indicators.ema;
  this.emas.unshift(ema.result);
  if (this.emas.length > this.settings.ema.persistence + 1) this.emas.pop();

  if (this.emas.length < this.settings.ema.persistence + 1) {
    return;
  }

  // log.debug('EMA ', this.emas[0], this.emas[1], this.emas[2]);

  // If the current ema is more than the previous ema,
  // then we are in an increasing market. Lets say that is 
  // a buy then. The moment that changes around, we will sell.

  if (this.target == null 
   && rsi.result <= this.settings.rsa.low) {
   //&& this.emas[0] > this.emas[1]) {
    this.buy(candle);
  } else if (this.target != null
          && (candle.close <= this.stop)) {
     this.sell(candle);
  } else if (this.target != null 
          && candle.close > this.target 
          && this.emas[0] > this.emas[1]) {
            // do we even care about rsi high?
            // rsi.result >= this.settings.rsa.high

    // We pushed out of our target and we are still running a positive trend
    // set a new higher target
    this.target = candle.close * this.longPerc;
    this.stop = candle.close * this.stopLoss;
    log.debug('bubble at %s (%s, %s)', candle.close, this.target, this.stop);
  }

}

module.exports = strat;
