const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.reward({minerWallet: this. wallet})
    );
    this.blockchain.addBlock({data: validTransactions});
    this.pubsub.broadcastChain();
    this.transactionPool.clear(); 
  }
}

module.exports = TransactionMiner;
