
const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');


class Wallet{

  constructor() {
      this.balance = INITIAL_BALANCE;
      this.keyPair = ChainUtil.genKeyPair();
      this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  createTransaction(recipient, amount, blockchain, pool) {
    this.balance = this.calculateBalance(blockchain)

    if (amount > this.balance){
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`)
      return;
    }

    let transaction = pool.existingTransaction(this.publicKey);
    if (transaction){
      transaction.update(this, recipient, amount)
    }else{
      transaction = Transaction.newTransaction(this, recipient, amount);
      pool.addOrUpdateTransaction(transaction);
    }

    return transaction;
  }

  toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance: ${this.balance}`
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  calculateBalance(blockchain) {
    let transactions = [];
    let balance = this.balance;
    blockchain.chain.forEach(block => block.data.forEach(transaction => transactions.push(transaction)));
    const walletInputTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey);


    let lastTransactionCretedTime = 0;
    if (walletInputTransactions.length > 0){
      const recentInputTransaction = walletInputTransactions.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);
      balance = recentInputTransaction.outputs.find(output => output.address === this.publicKey).amount;
      lastTransactionCretedTime = recentInputTransaction.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > lastTransactionCretedTime){
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance
  }

  static blockchainWallet(){
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}


module.exports = Wallet;
