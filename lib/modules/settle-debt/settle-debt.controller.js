const settleDebtController = (() => {
    'use strict';

    const moduleConfig = require("./settle-debt.config");
    const HTTPStatus = require('http-status');
    const errorHelper = require("../../helpers/error.helper");
    const energyTradingHelper = require("../../helpers/energy-trading-contract.helper");

    function settleDebtModule() {}
    const _p = settleDebtModule.prototype;

    _p.checkValidationErrors = async (req) => {
        req.checkBody('energyConsumed', moduleConfig.message.validationErrMessage.energyConsumed).notEmpty();
        req.checkBody('energyProduced', moduleConfig.message.validationErrMessage.energyProduced).notEmpty();
        req.checkBody('userAddress', moduleConfig.message.validationErrMessage.userAddress).notEmpty();

        const result = await req.getValidationResult();
        return result.array();
    };

    _p.checkValidationErrorsForUserAddress = async (req) => {
        req.checkBody('userAddress', moduleConfig.message.validationErrMessage.userAddress).notEmpty();

        const result = await req.getValidationResult();
        return result.array();
    }

    _p.settleUserDebt = async (req, res, next) => {
        try{
            const errors = await _p.checkValidationErrorsForUserAddress(req);
            if(errors && errors.length){
                return res.status(HTTPStatus.BAD_REQUEST).json({
                    status: HTTPStatus.BAD_REQUEST,
                    message: errorHelper.sendFormattedErrorData(errors)
                })
            }
            const code = await energyTradingHelper.settleDebtData(req);

            const SerializedTx = await energyTradingHelper.createTransaction(req, res, next, code, 61000, 0);

            const responseData = await energyTradingHelper.sendTransaction(req, SerializedTx.serializedTx);

            if(responseData) {
                return res.status(HTTPStatus.OK).json({
                    status: HTTPStatus.OK,
                    message: moduleConfig.message.postDataSuccess,
                    data: responseData
                })
            }
        } catch(err) {
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    };

    return {
        settleUserDebt: _p.settleUserDebt
    }
})();

module.exports = settleDebtController;