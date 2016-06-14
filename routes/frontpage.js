/**
 * Created by Phaeton on 12.06.2016.
 */
//var HttpError = require("error").HttpError;
exports.get = function (req, res, next) {
    //req.session.user = req.user = res.locals.user = null;
    res.render ("index");
};