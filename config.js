const cryptoHash = require("./crypto-hash");

const timestamp = 1;
const lastHash = null;
const data = [];
const hash = cryptoHash(timestamp, lastHash, data);

const GENESIS_DATA = {
  timestamp,
  lastHash,
  hash,
  data,
};

module.exports = { GENESIS_DATA };
