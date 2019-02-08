const powerAdminDueController = (() => {
    'use strict';

    const moduleConfig = require("./power-admin-due.config");
    const HTTPStatus = require('http-status');
    const errorHelper = require("../../helpers/error.helper");
    const energyTradingHelper = require("../../helpers/energy-trading-contract.helper");

    function powerAdminDueModule() {}
    const _p = powerAdminDueModule.prototype;

    _p.getPowerAdminDue = async (req, res, next) => {
        try{
            // const errors = await _p.checkValidationErrorsForUserAddress(req);
            // if(errors && errors.length){
            //     return res.status(HTTPStatus.BAD_REQUEST).json({
            //         status: HTTPStatus.BAD_REQUEST,
            //         message: errorHelper.sendFormattedErrorData(errors)
            //     })
            // }
            const powerAdminDue = await energyTradingHelper.getPowerAdminDue(req);
            if(powerAdminDue) {
                return res.status(HTTPStatus.OK).json({
                    status: HTTPStatus.OK,
                    message: moduleConfig.message.success,
                    data: powerAdminDue
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
        getPowerAdminDue: _p.getPowerAdminDue
    }
})();

module.exports = powerAdminDueController;