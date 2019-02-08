const handlebarController = (() => {
    'use strict';

    function handlebarModule() {

    }

    const _p = handlebarModule.prototype;

    _p.home = async (req, res, next) => {
        res.render('home');
    };

    return {
        home: _p.home
    }
})();

module.exports = handlebarController;