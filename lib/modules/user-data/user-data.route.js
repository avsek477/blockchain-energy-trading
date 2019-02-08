const userDataRouter = (() => {
    'use strict';

    const express = require('express');
    const userDataRouter = express.Router();
    const userDataController = require("./user-data.controller");

    userDataRouter.route('/').post(userDataController.saveUserEnergyData);
    
    userDataRouter.route('/:userAddress').get(userDataController.getUserEnergyData);
    
    userDataRouter.route('/send/random-data').post(userDataController.sendRandomUserEnergyData);

    return userDataRouter;
})();

module.exports = userDataRouter;