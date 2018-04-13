require('../array.extensions')
const Blockchain = require('./index');
const Block = require('./block');


describe('BlockChain', ()=> {
  let blockchain;
  let newBlockchain;
  beforeEach(()=> {
    blockchain = new Blockchain();
    newBlockchain = new Blockchain();
  })

  it('must create genesis block', () => {
    expect(blockchain.chain.first().hash).toEqual(Block.genesis().hash);
  })

  it('adds a new block', () => {
    const data = 'hello';
    blockchain.addBlock(data);
    expect(blockchain.chain.last().data).toEqual(data);
  })

  it('validates a chain', () => {
    newBlockchain.addBlock('hello');
    expect(blockchain.isValid(newBlockchain.chain)).toBe(true);
  })

  it('invalidates a chain with a corrupt genesis block', () => {
    newBlockchain.chain.first().data = 'new genesis';
    expect(blockchain.isValid(newBlockchain.chain)).toBe(false);
  })

  it('invalidates a corrupt chain', () => {
    newBlockchain.chain.last().data = 'corrupt data';
    expect(blockchain.isValid(newBlockchain.chain)).toBe(false);
  })

  it('replace the chain with valid chain', () => {
    expect(blockchain.replaceTheChain(newBlockchain.chain)).toEqual(newBlockchain.last)
  })

  it('does not replace the chain with one is less or equal to length', () => {
    blockchain.addBlock('foo');
    blockchain.replaceTheChain(newBlockchain.chain);
    expect(newBlockchain.chain.last().hash).not.toEqual(blockchain.chain.last().hash);
  })

  it('does not replace the chain with one is not valid chain', () => {
    const data = 'test';
    newBlockchain.addBlock(data);
    newBlockchain.chain.last().data = 'corrupted';

    blockchain.replaceTheChain(newBlockchain.chain);

    expect(newBlockchain.chain.last().hash).not.toEqual(blockchain.chain.last().hash);
  })

})
