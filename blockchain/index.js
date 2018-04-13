require('../array.extensions.js')
const Block = require('./block');

class Blockchain{

  constructor(){
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain.last()
    const block = Block.mine(lastBlock, data);
    this.chain.push(block);
    return block;
  }

  isValid(chain) {
    // Genesis block is different then it's not valid
    if (JSON.stringify(chain.first()) != JSON.stringify(Block.genesis())) return false;

    for(let i = 1; i < chain.length ; i++){
      const block = chain[i];
      const previousBlock = chain[i-1];

      // Chain corrupted
      if (block.previousHash !== previousBlock.hash) return false;

      // Block data corrupted
      if (block.hash !== Block.hashOfBlock(block)) return false
    }

    return true
  }

  replaceTheChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer!')
      return;
    }
    if (!this.isValid(newChain)) {
      console.log('Received chain is not valid!')
      return;
    }
    console.log('Chain replaced with new chain.')
    this.chain = newChain;
  }

}

module.exports = Blockchain
