const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {

  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPoll = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPoll.validTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPoll.clear();
    this.p2pServer.broadcastClearTransactions();

    return block
  }
}


module.exports = Miner;
