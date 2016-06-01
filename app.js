var express = require('express');
var http = require('http');
var path = require('path');
var config = require("config");
var log = require("libs/log")(module);
var error = require("error");

var app = express();

app.engine("ejs", require("ejs-locals"));
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(express.favicon());

if (app.get("env") === "development") app.use(express.logger('dev'));
else app.use(express.logger('default'));

app.use(express.bodyParser());
//app.use(express.json());
app.use(express.cookieParser());
//app.use(express.urlencoded());

app.use(require("middleware/sendHttpError"));

app.use(app.router);

require("routes")(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    if (typeof err === "number") {
        err = new error.HttpError(err);
    };

    if (err instanceof error.HttpError){
        res.sendHttpError(err);
    } else {
        if (app.get("env") === "development") {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            res.sendHttpError(err);
        };
    }
});

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});