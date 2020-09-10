const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
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
