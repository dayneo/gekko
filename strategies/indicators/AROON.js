
var log = require('../../core/log');

// required indicators
// var SMMA = require('./SMMA.js');


// AROON indicator as defined by https://www.investopedia.com/articles/trading/06/aroon.asp
// Read more: Finding The Trend With Aroon https://www.investopedia.com/articles/trading/06/aroon.asp#ixzz54enJMCVs 
// AroonUp   - [(# of periods) - (# of periods since highest high)] / (# of periods)] x 100 
// AroonDown - [(# of periods) - (# of periods since lowest low)] / (# of periods)] x 100

var Indicator = function (settings) {
  this.input = 'candle';
  this.interval = settings.interval;
  this.up = 0;
  this.down = 0;

  this.dataset = [{high: 0, low: 0}];
  this.highestHigh = 0;
  this.lowestLow = 0;
}

Indicator.prototype.update = function (candle) {

  log.debug('Aroon compute for %s (%s, %s)', candle.start, candle.high, candle.low);

  this.dataset.unshift({high: candle.high, low: candle.low});
  if (this.dataset.length > this.interval) {
    this.dataset.pop();
  }

  this.highestHigh = (this.dataset[this.highestHigh].high < candle.high) ? 0 : this.highestHigh + 1;
  if (this.highestHigh == this.dataset.length) {
    log.debug('  looking for new high...');
    let high = 0;
    this.dataset.forEach((entry, index) => {
      if (entry.high > high) {
        high = entry.high;
        this.highestHigh = index;
      }
    });
  }

  this.lowestLow = (this.dataset[this.lowestLow].low > candle.low) ? 0 : this.lowestLow + 1;
  if (this.lowestLow == this.dataset.length) {
    log.debug('  looking for new low...');
    let low = Number.MAX_VALUE;
    this.dataset.forEach((entry, index) => {
      if (entry.low < low) {
        low = entry.low;
        this.lowestLow = index;
      }
    });
  }

  this.up = (this.interval - (this.highestHigh + 1)) / this.interval;
  this.down = (this.interval - (this.lowestLow + 1)) / this.interval;

  log.debug('  (%s, %s) at [%s, %s]', this.up, this.down, this.highestHigh, this.lowestLow);
}

module.exports = Indicator;
