'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require("express-validator");
const web3Connector = require("./lib/helpers/web3.helper");
const router = require("./lib/routes/index");
const exphbs = require("express-handlebars");
const app = express();

web3Connector.init(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;
    
        while (namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }
        return {
          param: formParam,
          msg: msg,
          value: value
        };
    }
}));

app.use('/energy-trading', express.static('views'));

app.use((req, res, next) => {
    if(app.locals.web3){
        try{
            app.locals.web3.eth.net.isListening().then((status) => {
                console.log("===websocket web3 status===", status);
                if(!status) {
                    console.log("====reconnecting websocket web3===");
                    web3Connector.init(app);
                }
            }).catch(e => {
                console.log("===reconnecting websocket web3====", e);
                web3Connector.init(app);
            })
        } catch(e) {
            console.log("====reconnecting websocket web3====");
            web3Connector.init(app);
        }
        req.web3 = app.locals.web3;
    }

    if(app.locals.Contract) {
        req.Contract = app.locals.Contract;
    }
    next();
})

router.init(app);


// app.get('/', function (req, res) {
//     res.render('home');
// })

module.exports = app;