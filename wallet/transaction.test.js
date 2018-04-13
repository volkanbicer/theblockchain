const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction', () => {
  let transaction, wallet, amount, recipient

  beforeEach(() => {
    wallet = new Wallet();
    amount = 5;
    recipient = 'r3c1p13nt'
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  })

  it('Outputs the amount substracted from balance', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
  })

  it('outputs the `amount` added to the recipient', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
  })

  describe('transacting with an amount exceeds the balance', () => {

    beforeEach(() => {
      amount = wallet.balance + 1;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    })

    it('should not create transaction', () => {
      expect(transaction).toEqual(undefined);
    })

  })

  describe('updating transaction', () => {
    let nextamount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = "n3xt-4ddr355"
      transaction = transaction.update(wallet, nextRecipient, nextAmount)
    })

    it(`substracts the next amount from sender's output`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - nextAmount - amount);
    })

    it('outputs an amont for next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
    })
  })

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    })

    it(`reward the miner's wallet`, () => {
      expect(transaction.outputs.find(o => o.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
    })
  })

})
