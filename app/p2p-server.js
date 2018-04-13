const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS',
};

class P2pServer{

  constructor(blockchain, transactionPool){
      this.blockchain = blockchain
      this.transactionPoll = transactionPool
      this.sockets = []
  }

  listen(){
    const server = new Websocket.Server({ port: P2P_PORT })
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for p2p connections on : ${P2P_PORT}`);
  }

  connectToPeers(){
    peers.forEach(peer => {
      const socket = new Websocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  connectSocket(socket){
    console.log('Socket connected');
    this.sockets.push(socket);
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket){
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch (data.type){
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceTheChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPoll.addOrUpdateTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clear_transactions:
          this.transactionPoll.clear();
        default:
          break;
      }

    })
  }

  sendChain(socket){
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  sendTransaction(socket, transaction){
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  sendClearTransactions(socket){
    socket.send(JSON.stringify({type: MESSAGE_TYPES.clear_transactions}))
  }

  sendPeers(socket){
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.peers,
      peers
    }));
  }

  syncChains(){
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction){
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions(){
    this.sockets.forEach(this.sendClearTransactions);
  }


  addPeer(peer){
    if (peers.indexOf(peer) !== -1) return;

    peers.push(peer)
    const socket = new Websocket(peer)
    socket.on('open', () => this.connectSocket(socket))
  }

}

module.exports = P2pServer;
