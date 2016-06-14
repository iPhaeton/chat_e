/**
 * Created by Phaeton on 12.06.2016.
 */
var User = require("models/user").User;

module.exports = function (req, res, next) {
    req.user = res.locals.user = null;

    if (!req.session.user) return next();

    User.findById(req.session.user, function (err, user) {
        if (err) return next();

        req.user = res.locals.user = user;
        next();
    })
};