/**
 * Created by Phaeton on 12.06.2016.
 */
var User = require("models/user").User;
var HttpError = require("error").HttpError;
var AuthError = require("models/user").AuthError;

exports.get = function (req, res, next) {
    res.render ("login");
    //next(new HttpError(403, "Error"));
};

exports.post = function (req, res ,next) {
    var username = req.body.username,
        password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, "Wrong password"));
            } else {
                return next(err);
            };
        };

        req.session.user = user._id;
        res.send({});
    })
};