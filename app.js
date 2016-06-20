var express = require('express');
var http = require('http');
var path = require('path');
var config = require("config");
var log = require("libs/log")(module);
var error = require("error");
var mongoose = require("libs/mongoose");

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

var MongoStore = require("connect-mongo")(express);

app.use(express.session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

/*app.use(function (req, res, next) {
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    res.send("Visits:" + req.session.numberOfVisits);
});*/

app.use(require("middleware/sendHttpError"));
app.use(require("middleware/loadUser"));

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

var server = http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

require("./socket")(server);