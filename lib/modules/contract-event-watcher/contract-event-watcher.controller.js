const contractEventWatcherController = (() => {
    'use strict';

    const HTTPStatus = require('http-status');
    const BigNumber = require("bignumber.js");
    const energyTradingHelper = require("../../helpers/energy-trading-contract.helper");
    const secretConfig = require("../../secrets/secret.json");
    const moduleConfig = require("./contract-event-watcher.config");

    function eventWatcherModule() {}

    const _p = eventWatcherModule.prototype;

    _p.duePayment = async (error, result, app) => {
        try {
            if(error) {
                console.log("====error on event watcher function====", error);
            } else {
                console.log("Event Caught");
                const checkAddress = "0x" + result.raw.topics[2].substring(26, result.raw.topics[2].length).toLowerCase();
                if(checkAddress === secretConfig.contract_owner.public_key.toLowerCase()) {
                    const value = parseInt(result.raw.data, 16);
                    const weiToNum = (new BigNumber(value.toString()).dividedBy(new BigNumber(10).pow(18))).toNumber();

                    const code = await energyTradingHelper.settleDueForPowerAdmin(app.locals, weiToNum);
                    const SerializedTx = await energyTradingHelper.createTransaction(app.locals, null, null, code, 61000, 0);
                    const responseData = await energyTradingHelper.sendTransaction(app.locals, SerializedTx.serializedTx);
                    if(responseData) {
                        console.log(responseData.transactionHash, "Power Admin due paid");
                    }
                }
            }
        } catch(err) {
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    };

    _p.initListen = async (app) => {
        if(app.locals.XcelContract) {
            console.log("EVENT WATCH STARTED...");

            app.locals.XcelContract.events.Transfer({fromBlock: "latest", toBlock: "latest"}, (error, result) => {
                _p.duePayment(error, result, app);
            })
        } else {
            return;
        }
    };

    return {
        init: _p.initListen
    }
})();

module.exports = contractEventWatcherController;