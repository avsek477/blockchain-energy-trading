const powerAdminDueRouter = (() => {
    'use strict';

    const express = require('express');
    const powerAdminDueRouter = express.Router();
    const powerAdminDueController = require("./power-admin-due.controller");

    powerAdminDueRouter.route('/').get(powerAdminDueController.getPowerAdminDue);

    return powerAdminDueRouter;
})();

module.exports = powerAdminDueRouter;