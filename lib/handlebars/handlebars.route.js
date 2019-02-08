const handlebarRoutes = (() => {
    'use strict';

    const express = require('express');
    const hbsRouter = express.Router();

    const hbsController = require('./handlebars.controller');

    hbsRouter.route('/').get(hbsController.home);

    return hbsRouter;
})();

module.exports = handlebarRoutes;