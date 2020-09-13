const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  existingTransaction({ inputAddress }) {
    const transactions = Object.values(this.transactionMap);
    return transactions.find(
      (transaction) => transaction.input.address === inputAddress
    );
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  validTransactions() {
    const transactions = Object.values(this.transactionMap);
    return transactions.filter((transaction) =>
      Transaction.isValid(transaction)
    );
  }
}

module.exports = TransactionPool;
