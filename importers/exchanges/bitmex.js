import { BitmexAPI } from 'bitmex-node';
const util = require('../../core/util.js');
const _ = require('lodash');
const moment = require('moment');
const log = require('../../core/log');

const config = util.getConfig();
const dirs = util.dirs();
const Fetcher = require(dirs.exchanges + 'bitmex');
const retry = require(dirs.exchanges + '../exchangeUtils').retry;

util.makeEventEmitter(Fetcher);
var fetcher = new Fetcher(config.watch);

var fetch = () => {
  fetcher.import = true;

  if (lastTimestamp) {
    // We need to slow this down to prevent hitting the rate limits
    setTimeout(() => {
      // make sure we fetch with overlap from last batch
      const since = lastTimestamp - 1000;
      fetcher.getTrades(since, handleFetch);
    }, 2500);
  } else {
    lastTimestamp = from.valueOf();
    batch_start = moment(from);
    batch_end = moment(from).add(stride, 'h');

    fetcher.getTrades(batch_end, handleFetch);
  }
};

module.exports = function(daterange) {
  from = daterange.from.clone();
  end = daterange.to.clone();

  return {
    bus: fetcher,
    fetch: fetch,
  };
};
