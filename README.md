# theblockchain

Fully functional block chain application.

Supported features:
* P2P server
  * Sync chain
  * Broadcast new transaction  
* HTTP server endpoints
  * `/transactions`
  * `/mine`
  * `/transact`
  * `/blocks`
  * `/public/key`
  * `/balance`
* Create transaction  
  * Regular transaction
  * Reward transaction (Miners get when mine a new block)
* Mine new block
  * Proof-of-work algorithm
  * Dynamic difficulty calculation  
* Wallet

## Install
Install npm dependencies in project folder.

```
npm install
```

## Test
Run the tests.
```
npm run test
```

## Running
Run the application in development
```
npm run dev
```

If you want to start multiple node. `./run.sh` (created super node) then open another terminal and type `./run2.sh` (create second node) which aware from first node

You can create `n` node by providing `HTTP_PORT`, `P2P2P_PORT` and `PEERS` as environment variable.

```
HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

```
