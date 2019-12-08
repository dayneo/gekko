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

var AROON = require('./indicators/AROON.js');

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.name = 'dayneo - Alternating Buy/Sell';
  this.input = 'candle';
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.tradeAgainst = this.settings.tradeAgainst; // true/false

  // define the indicators we need
  this.addIndicator('aroon', 'AROON', this.settings);
}

strat.log = function(candle) {
  var aroon = this.indicators.aroon;
  log.debug('calculated AROON (%s): %s, %s', aroon.interval, aroon.up, aroon.down);
}

// What happens on every new candle?
strat.update = function(candle) {

}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
  let aroon = this.indicators.aroon;
  let advice = this.tradeAgainst ? 'short' : 'long';
  if ((!this.tradeAgainst && aroon.up > aroon.down) 
   || (this.tradeAgainst && aroon.up < aroon.down)) {
    this.advice('long');
  } else {
    this.advice('short');
  }
}

module.exports = strat;
