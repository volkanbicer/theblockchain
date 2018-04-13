
const { DIFFICULTY, MINE_RATE } = require('../config');
const ChainUtil = require('../chain-util');


class Block {

  constructor(timestamp, previousHash, data, nonce, difficulty) {
    this.timestamp = timestamp
    this.previousHash = previousHash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty || DIFFICULTY
    this.hash = Block.hash(timestamp, previousHash, data, nonce, difficulty)
  }

  toString() {
    return `Block -
      Timestamp     : ${this.timestamp}
      Previous hash : ${this.previousHash}
      Hash          : ${this.hash}
      Nonce         : ${this.nonce}
      Difficulty    : ${this.difficulty}
      Data          : ${this.data}
    `
  }

  static genesis() {
    return new this('Genesis time', '-', [], 100, DIFFICULTY);
  }

  static mine(lastBlock, data){
    let hash, timestamp;
    let nonce = 0;
    let difficulty = lastBlock.difficulty

    do {
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty(lastBlock, timestamp);
        hash = Block.hash(timestamp, lastBlock.hash, data, nonce, difficulty);
    }while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastBlock.hash, data, nonce, difficulty);
  }

  static hash(timestamp, previousHash, data, nonce, difficulty){
    return ChainUtil.hash(`${timestamp}${previousHash}${data}${nonce}${difficulty}`)
  }

  static hashOfBlock(block){
    const { timestamp, previousHash, data, nonce, difficulty} = block;
    return Block.hash(timestamp, previousHash, data, nonce, difficulty)
  }

  static adjustDifficulty(lastBlock, currentTime){
    let { difficulty } = lastBlock
    if ((lastBlock.timestamp + MINE_RATE) > currentTime){
      difficulty++;
    }else{
      difficulty--;
    }
    return difficulty;
  }

}


module.exports = Block
