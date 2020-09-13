const { MINE_RATE, GENESIS_DATA } = require("../config");
const cryptoHash = require("../util/crypto-hash");
const hexToBinary = require("hex-to-binary");

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock;

    if (difficulty < 1) {
      return 1;
    }

    if (timestamp - lastBlock.timestamp > MINE_RATE) {
      return difficulty - 1;
    }

    return difficulty + 1;
  }

  static mine({ lastBlock, data }) {
    let hash;
    let timestamp;
    let nonce = 0;
    let { difficulty } = lastBlock;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty({ lastBlock, timestamp });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({ timestamp, lastHash, data, hash, nonce, difficulty });
  }
}

module.exports = Block;
