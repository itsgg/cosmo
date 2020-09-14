const Block = require("./block");
const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

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
      const lastDifficulty = chain[i - 1].difficulty;

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

      if (Math.abs(lastDifficulty - difficulty) > 1) {
        return false;
      }
    }

    return true;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;
      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;
          if (rewardTransactionCount > 1) {
            console.error("minor rewards exceed limit");
            return false;
          }
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.isValid(transaction)) {
            console.log("invalid transaction");
            return false
          }
          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });
          if (transaction.input.amount !== trueBalance) {
            console.error("invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error("duplicate transaction");
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
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

  replace(chain, onSuccess) {

    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValid(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (!this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid transaction data");
      return;
    }

    if (onSuccess) {
      onSuccess();
    }

    console.log("replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
