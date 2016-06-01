/**
 * Created by Phaeton on 01.06.2016.
 */
var path = require("path");
var util = require("util");
var http = require("http");

//Request errors
function HttpError (statusCode, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.statusCode = statusCode;
    this.message = message || http.STATUS_CODES[statusCode] || "Error";
};
util.inherits(HttpError, Error);
HttpError.prototype.name = "RequestError";

exports.HttpError = HttpError;