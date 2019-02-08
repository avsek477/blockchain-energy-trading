((web3Helper) => {
    'use strict';

    const Web3 = require('web3');
    const contractAbiConfig = require('../configs/contract.abi');
    const secretConfig = require('../secrets/secret.json');
    const contractEventWatcher = require("../modules/contract-event-watcher/contract-event-watcher.controller");

    web3Helper.init = (app) => {
        const provider = new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws");
        const web3 = new Web3(provider);
        const contractAbi = contractAbiConfig.abi;
        const contractAddress = secretConfig.contract_address.energy_trading;
        const xcelContractAbi = contractAbiConfig.xcelAbi;
        const xcelContractAddress = secretConfig.contract_address.xceltoken;
        const Contract = new web3.eth.Contract(contractAbi, contractAddress);
        const XcelContract = new web3.eth.Contract(xcelContractAbi, xcelContractAddress);

        provider.on('connect', (e) => {
            console.log('Web3 connected to provider');
        })

        app.locals.web3 = web3;
        app.locals.Contract = Contract;
        app.locals.XcelContract = XcelContract;

        contractEventWatcher.init(app);

        return {
            web3: web3,
            Contract: Contract,
            XcelContract: XcelContract
        }
    }
})(module.exports);