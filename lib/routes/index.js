((applicationRoutes) => {
    'use strict';

    applicationRoutes.init = (app) => {
        const apiBase = "/api/";

        const userDataRouter = require("../modules/user-data/user-data.route");
        app.use(`${apiBase}user-data`, userDataRouter);

        const settleDebtRouter = require("../modules/settle-debt/settle-debt.route");
        app.use(`${apiBase}settle-debt`, settleDebtRouter);

        const powerAdminDueRouter = require("../modules/power-admin-due/power-admin-due.route");
        app.use(`${apiBase}power-admin-due`, powerAdminDueRouter);
        
        const handlebarRouter = require("../handlebars/handlebars.route");
        app.use('/', handlebarRouter);
    }
})(module.exports);