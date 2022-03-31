# farming_app
**Development of template for a farming app**

Install dependencies
```
npm install
```

Compile
```
truffle compile
```

Deploy contract
```
truffle migrate --reset
```

Deploy contract to specific net
```
truffle migrate --reset --network {mainnet,rinkeby,mumbai} 
```

Launch truffle console
```
truffle console
```

Run a script example
```
truffle exec scripts/issue-tokens.js
```

Run tests
```
truffle test 
```

Install web dependencies
```
npm install
npm i dotenv
npm install @truffle/hdwallet-provider
```

Run web application
```
npm run start
```

*Setting .env parameters*

Create .env file in the project folder and fill the addresses you will use:
```
PRIVATE_KEY_0="..."
PRIVATE_KEY_1="..."
SECRET_KEY="..."
RINKEBY_SERVER="..."
ETHER_MAINNET_SERVER="..."
MUMBAI_SERVER="..."
```


---
**Project folders**

`migrations` - deployment scripts

`scripts` - scripts to launch smart contract functionality

`src/contracts` - smart contract sources

`src/abi` - ABIs of smart contracts

`src/components` - js/css sources of the frontend solution

`test` - js tests of smart contract logic

---
**Usage**

1. Open a page created by the command `npm run start` - localhost:3000
2. Switch to the wallet account[1] which got 100 mDAI after deployment
3. Choose the amount of DAI you have to stake and press "STAKE!"
4. Confirm "approve" and "send" mDAI.
5. Refresh the page. You will see the reduced balance of DAI and non-zero "Staking Balance" 
6. Run the script to issue reward tokens `truffle exec scripts/issue-tokens.js`
7. Refresh the page and notice non-zero "Reward Balance"
8. Press "UN-STAKE..." and confirm the transaction.
9. Refresh and notice zero "Staking Balance", delault amount of mDAI and the same Balance of Reward Tokens

