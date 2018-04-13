const ChainUtil = require('../chain-util')
const { MINING_REWARD } = require('../config');


class Transaction {

  constructor () {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(sender, recipient, amount){
    let senderOutput = this.outputs.find(output => output.address === sender.publicKey);
    if (amount > senderOutput.amount){
      console.log(`Amount ${amount} exceeds balance.`);
      return;
    }
    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({amount, address: recipient});
    Transaction.signTransaction(this, sender);
    return this;
  }

  static transactionWithOutputs(sender, outputs){
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, sender);
    return transaction;
  }

  static newTransaction(sender, recipient, amount){
    if (amount > sender.balance){
      console.log(`Amount: ${amount} exceeds balanace.`);
      return;
    }
    const outputs = [
      { amount: sender.balance - amount, address: sender.publicKey},
      { amount, address: recipient}
    ]
    return Transaction.transactionWithOutputs(sender, outputs);
  }

  static rewardTransaction(minerWallet, blockchainWallet){
    return Transaction.transactionWithOutputs(blockchainWallet, [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey
      }
    ])
  }

  static signTransaction(transaction, sender){
    transaction.input = {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  static verifyTransaction(transaction){
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    );
  }
}


module.exports = Transaction
