const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', ()=>{
  let wallet, pool, blockchain;

  beforeEach(()=>{
    wallet = new Wallet();
    pool = new TransactionPool();
    blockchain = new Blockchain();
  })

  it('should have public key', ()=> {
    expect(wallet.publicKey).not.toBe(undefined);
  })

  describe('creating transaction', () => {
    let transaction, amount, recipient

    beforeEach(() => {
      amount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(recipient, amount, blockchain, pool);
    })

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, amount, blockchain, pool);
      })

      it('doubles the `amount` substracted from the wallet balance', () => {
        expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(wallet.balance - (2 * amount))
      })

      it('clones the `amount` output for the recipient', () => {
        expect(transaction.outputs.filter(o => o.address === recipient)
                                  .map(o => o.amount)).toEqual([amount, amount])
      })
    })
  })

  describe('calculating a balance', () => {
    let addBalance, repeatAdd, senderWallet

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++){
        senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, pool);
      }
      blockchain.addBlock(pool.transactions);
    })

    it('calculates the balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
    })

    it('calculates the balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
    })

    describe('and the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        pool.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(blockchain);
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, blockchain, pool)
        blockchain.addBlock(pool.transactions);
      })

      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          pool.clear();
          senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, pool);
          blockchain.addBlock(pool.transactions);
        })

        it('calculates the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(blockchain)).toEqual(recipientBalance - subtractBalance + addBalance);
        })
      })
    })
  })

})
