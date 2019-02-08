const settleDebtRouter = (() => {
    'use strict';

    const express = require('express');
    const settleDebtRouter = express.Router();
    const settleDebtController = require("./settle-debt.controller");

    settleDebtRouter.route('/').post(settleDebtController.settleUserDebt);

    return settleDebtRouter;
})();

module.exports = settleDebtRouter;