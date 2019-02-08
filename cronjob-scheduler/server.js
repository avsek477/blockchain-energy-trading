const CronJob = require('cron').CronJob;
const rp = require('request-promise');

const routesConfig = require("./configs/routes.config");

const makePOSTApiRequest = async (url) => {
    try {
        const options = {
            method: 'POST',
            uri: url,
            json: true, // Automatically stringifies the body to JSON
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            rp(options)
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    resolve(err);
                });
        });
    } catch (err) {
        // return next(err);
    }
}

new CronJob('0 */10 * * * *', async () => {
    console.log('========================================================================================================================');
    console.log('Send User Energy Consumption Data', new Date().toLocaleString());
    console.log('========================================================================================================================');
    const data = await makePOSTApiRequest(routesConfig.postEnergyData);
    console.log("==response==",data);
}, null, true, 'America/Los_Angeles');

