const userDataController = (() => {
    'use strict';

    const moduleConfig = require("./user-data.config");
    const HTTPStatus = require('http-status');
    const errorHelper = require("../../helpers/error.helper");
    const energyTradingHelper = require("../../helpers/energy-trading-contract.helper");
    const asyncForEachHelper = require("../../helpers/async-loop.helper");

    function userDataModule() {}
    const _p = userDataModule.prototype;

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

    _p.saveUserEnergyData = async (req, res, next) => {
        try{
            const errors = await _p.checkValidationErrors(req);
            if(errors && errors.length){
                return res.status(HTTPStatus.BAD_REQUEST).json({
                    status: HTTPStatus.BAD_REQUEST,
                    message: errorHelper.sendFormattedErrorData(errors)
                })
            }
            const code = await energyTradingHelper.postDataToContract(req);

            const SerializedTx = await energyTradingHelper.createTransaction(req, res, next, code, 61000, 0);

            const responseData = await energyTradingHelper.sendTransaction(req, SerializedTx.serializedTx);

            if(responseData ) {
                if(req.body.sendResponseStatus){
                    console.log(responseData)
                }else{
                    return res.status(HTTPStatus.OK).json({
                        status: HTTPStatus.OK,
                        message: moduleConfig.message.postDataSuccess,
                        data: responseData
                    })
                }
            }
        } catch(err) {
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    };

    _p.getUserEnergyData = async (req, res, next) => {
        try{
            const userData = await energyTradingHelper.getEnergyDataOfUser(req);
            if(userData) {
                return res.status(HTTPStatus.OK).json({
                    status: HTTPStatus.OK,
                    message: moduleConfig.message.getDataSuccess,
                    data: userData
                })
            } 
        } catch(err) {
            return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
                status: HTTPStatus.INTERNAL_SERVER_ERROR,
                message: err.message
            });
        }
    };

    _p.generateRandomInteger = () => {
        return Math.floor(Math.random() * 10);
    };

    _p.sendRandomUserEnergyData = async (req, res, next) => {
        const registeredUsers = await energyTradingHelper.getAllUserAddresses(req);
        const forEachResp = await asyncForEachHelper.asyncForEachLoop(req, next, registeredUsers, null, async (req, next, registeredUser, data) => {
            try{
                req.params.userAddress = registeredUser;
                const registeredUserData = await energyTradingHelper.getEnergyDataOfUser(req);
                req.body.userAddress = registeredUser,
                req.body.energyConsumed = parseInt(registeredUserData[0]) + _p.generateRandomInteger(),
                req.body.energyProduced = parseInt(registeredUserData[1]) + _p.generateRandomInteger(),
                req.body.sendResponseStatus = true;
                await _p.saveUserEnergyData(req, res, next);
            } catch(error) {
                throw new Error(error);
            }
        });
        return res.status(HTTPStatus.OK).json({
            status: HTTPStatus.OK,
            message: moduleConfig.message.cronJobSuccess
        });
    };

    return {
        saveUserEnergyData: _p.saveUserEnergyData,
        getUserEnergyData: _p.getUserEnergyData,
        sendRandomUserEnergyData: _p.sendRandomUserEnergyData
    }
})();

module.exports = userDataController;