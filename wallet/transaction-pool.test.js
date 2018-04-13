require('../array.extensions');
const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');


describe('TransactionPool', () => {
  let pool, transaction, wallet, blockchain

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    blockchain = new Blockchain();
    transaction = wallet.createTransaction('r3c1p13nt-4ddr355', 5, blockchain, pool)
    pool.addOrUpdateTransaction(transaction);

  })

  it('adds transaction to the pool', () => {
    expect(pool.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  })

  it('updates transaction in the pool', () => {
    let oldTransaction = JSON.stringify(transaction);
    let newTransaction = transaction.update(wallet, 'an0th3r-r3c1p13nt', 10);
    pool.addOrUpdateTransaction(newTransaction);

    expect(JSON.stringify(pool.transactions.find(t => t.id == newTransaction.id))).not.toEqual(oldTransaction);
  })

  it('clears pool', () => {
    pool.clear();
    expect(pool.transactions).toEqual([]);
  })

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...pool.transactions];
      for (let i = 0; i<6; i++){
        wallet = new Wallet();
        transaction = wallet.createTransaction('r3c1p13nt-4ddr355', 30, blockchain, pool);
        if (i%2 == 0){
          transaction.input.amount = 999999;
        }else{
          validTransactions.push(transaction);
        }
      }
    })

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(pool.transactions)).not.toEqual(JSON.stringify(validTransactions));
    })

    it('grabs valid transactions', () => {
      expect(pool.validTransactions()).toEqual(validTransactions);
    })


  })
})
