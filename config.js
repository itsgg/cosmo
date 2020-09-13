const cryptoHash = require("./util/crypto-hash");

const MINE_RATE = 1000; // 1 Second
const INITIAL_DIFFICULTY = 3;
const STARTING_BALANCE = 1000;
const MINING_REWARD = 50;

const timestamp = 1;
const lastHash = null;
const data = [];
const nonce = 0;
const difficulty = INITIAL_DIFFICULTY;

const hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

const GENESIS_DATA = {
  timestamp,
  lastHash,
  hash,
  data,
  nonce,
  difficulty,
};

const REWARD_INPUT = {
  address: "*authorized-reward*",
};

module.exports = {
  MINE_RATE,
  GENESIS_DATA,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
};
