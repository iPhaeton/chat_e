/**
 * Created by Phaeton on 01.06.2016.
 */
module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        if (error.statusCode) res.status(error.statusCode);
        else res.status(500);
        
        if (res.req.headers["x-request-with"] === "XMLHttpRequest") {
            res.json(error);
        } else {
            res.render("error", {error: error});
        };
    };

    next();
};