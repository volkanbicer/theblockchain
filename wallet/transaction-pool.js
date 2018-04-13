const Transaction = require('./transaction');

class TransactionPool {

  constructor () {
    this.transactions = [];
  }

  addOrUpdateTransaction(transaction){
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId){
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    }else{
      this.transactions.push(transaction)
    }
  }

  existingTransaction(senderAddress){
    return this.transactions.find(t => t.input.address === senderAddress);
  }

  validTransactions() {
    return this.transactions.filter(this.isValid);
  }

  isValid(transaction) {
    const outputTotal = transaction.outputs.reduce((total, output) => {
      return total + output.amount
    }, 0);

    if (transaction.input.amount !== outputTotal){
      console.log(`Invalid transaction from ${transaction.input.address}`)
      return false;
    }

    if (!Transaction.verifyTransaction(transaction)){
      console.log(`Invlalid signature from ${transaction.input.address}`)
      return false;
    }

    return true;
  }

  clear(){
    this.transactions = [];
  }
}



module.exports = TransactionPool
