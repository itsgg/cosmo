const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  static isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const expectedLastHash = chain[i - 1].hash;

      if (lastHash !== expectedLastHash) {
        return false;
      }

      const expectedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== expectedHash) {
        return false;
      }
    }

    return true;
  }

  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];

    const newBlock = Block.mine({
      lastBlock,
      data,
    });

    this.chain.push(newBlock);
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  replace(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValid(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    console.log("replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
