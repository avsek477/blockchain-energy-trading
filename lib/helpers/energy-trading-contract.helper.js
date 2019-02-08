const energyTradingHelper = (() => {
    'use strict';

    const secretConfig = require("../secrets/secret.json");
    const EthereumTx = require('ethereumjs-tx');

    function energyTradingHelperModule() {}

    const _p = energyTradingHelperModule.prototype;

    _p.postDataToContract = async (req) => {
        try{
            const data = await req.Contract.methods.storeUserEnergyData(req.body.userAddress, req.body.energyConsumed, req.body.energyProduced).encodeABI();
            if(data) {
                return data;
            }
        }catch(err){
            return Promise.reject(err);
        }
    }

    _p.settleDebtData = async (req) => {
        try{
            const data = await req.Contract.methods.resetDifference(req.body.userAddress).encodeABI();
            if(data) {
                return data;
            }
        }catch(err){
            return Promise.reject(err);
        }
    }

    _p.settleDueForPowerAdmin = async (req, adminDue) => {
        try {
            const data = await req.Contract.methods.transferPowerAdminDues(adminDue).encodeABI();
            if(data) {
                return data;
            }
        } catch(err) {
            return Promise.reject(err);
        }
    };

    _p.getEnergyDataOfUser = async (req) => {
        return await req.Contract.methods.getUserEnergyData(req.params.userAddress).call();
    };

    _p.getAllUserAddresses = async (req) => {
        return await req.Contract.methods.getAllAddressses().call();
    };

    _p.getPowerAdminDue = async (req) => {
        return await req.Contract.methods.powerAdminDue().call();
    };

    const convertToHex = (req, input) => {
        return req.web3.utils.toHex(input);
    }

    _p.createTransaction = async (req, res, next, code, gasLimit, amount) => {
        try{
            const from = secretConfig.contract_owner.public_key;
            const to = secretConfig.contract_address.energy_trading;
            
            const nonce = await req.web3.eth.getTransactionCount(from, 'pending');

            const txParams = {
                from,
                nonce: convertToHex(req, nonce),
                gasLimit: convertToHex(req, 61000),
                gasPrice: convertToHex(req, req.web3.utils.toWei('21', 'gwei')), //21 Gwei
                value: convertToHex(req, amount),
                to
            }

            if (code) {
                txParams.data = code;
                let gas = await _p.estimateGas(req, txParams);
                if(gas > 61000) {
                    txParams.gasLimit = convertToHex(req, gas);
                }
            }

            const tx = new EthereumTx(txParams);
            tx.sign(Buffer.from(secretConfig.contract_owner.private_key, 'hex'));
            
            return {
                serializedTx: tx.serialize()
            }
        } catch(err) {
            return Promise.reject(err);
        }
    }

    _p.estimateGas = (req, transactionObject) => {
            return new Promise((resolve, reject) => {
                req.web3.eth.estimateGas({from: transactionObject.from, data: transactionObject.data, to: transactionObject.to}, function(err, estimatedGas){
                    if(!err){
                        resolve(estimatedGas);
                    } else{
                        reject(err);
                    }
                })
            })
    }

    _p.sendTransaction = (req, serializedTx) => {
        try{
            return new Promise((resolve, reject) => {
                req.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                    .on("transactionHash", function (txHash){
                        resolve(txHash);
                    })
                    // .on('receipt', function(receipt){
                    //     resolve(receipt);
                    // })
                    .on("error", function (error) {
                        reject(error);
                    })
            })
        } catch(err) {
            return Promise.reject(err);
        }
    }

    return {
        postDataToContract: _p.postDataToContract,
        createTransaction: _p.createTransaction,
        sendTransaction: _p.sendTransaction,
        getEnergyDataOfUser: _p.getEnergyDataOfUser,
        settleDebtData: _p.settleDebtData,
        getPowerAdminDue: _p.getPowerAdminDue,
        settleDueForPowerAdmin: _p.settleDueForPowerAdmin,
        getAllUserAddresses: _p.getAllUserAddresses,
        getRegisteredUsersData: _p.getRegisteredUsersData
    }

})();

module.exports = energyTradingHelper;