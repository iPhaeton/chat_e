var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.set("port", 3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(function (req, res, next) {
    if (req.url == "/") res.end ("Hello");
    else next ();
});

app.use (function (req, res, next) {
    if (req.url == "/forbidden") throw new Error ("Access denied");
    else next ();
});

app.use (function (req, res) {
    res.send (404, "Page not found");
});

app.use (function (err, req, res, next) {
    if (app.get ("env") === "development") {
        var errorHandler = express.errorHandler();
        errorHandler (err, req, res, next);
    }
    else res.send (401, "Access denied");
});

/*
var routes = require('./routes');
var user = require('./routes/user');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
*/