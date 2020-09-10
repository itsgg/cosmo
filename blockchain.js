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
      const { timestamp, lastHash, hash, data } = chain[i];
      const expectedLastHash = chain[i - 1].hash;

      if (lastHash !== expectedLastHash) {
        return false;
      }

      const expectedHash = cryptoHash(timestamp, lastHash, data);
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
}

module.exports = Blockchain;
