var async = require("async");
var log = require("libs/log")(module);
var config = require("config");
var sessionStore = require("libs/sessionStore");
//var connect = require("connect");
var cookie = require("cookie");
var HttpError = require("error").HttpError;
var User = require("models/user").User;

function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length === 0) {
            return callback(null, null);
        } else if (err) {
            return callback(err);
        } else {
            return callback(null, session);
        }
    })
};

function loadUser(session, callback) {
    if (!session.user) {
        log.debug("Session %s is anonymouse", session.id);
        return callback(null, null);
    };

    log.debug("Retrieving user", session.user);

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);
        if (!user) return callback(null, null);
        log.debug("User findbyId result: " + user);
        callback(null, user);
    })
}

module.exports = function (server) {
    var io = require("socket.io")({
        origins: "localhost:*",
        logger: log
    }).listen(server);

    //io.set("origins", "localhost:*");
    //io.set("logger", log);

    io.use(function (socket, next) {
        var handshake = socket.request;

        async.waterfall([
            function (callback) {
                handshake.cookies = cookie.parse(handshake.headers.cookie || "");
                var sidCookie = handshake.cookies[config.get("session:key")];

                var cookieParser = require("cookie-parser");
                var sid = cookieParser.signedCookie(sidCookie, config.get("session:secret"));

                loadSession(sid, callback);
            },
            function (session, callback) {
                if (!session) {
                    callback(new HttpError(401, "No session"));
                };

                handshake.session = session;
                loadUser(session, callback);
            },
            function (user, callback) {
                if (!user) {
                    callback(new HttpError(403, "Anonymous session"));
                };

                handshake.user = user;
                callback(null);
            }
        ], function (err) {
            if (!err) {
                return next();
            } else {
                return next(err);
            };
        });
    });

    io.sockets.on("sesreload", function (sid) {
        //var clients = io.sockets.clients().sockets;
        var clients = io.sockets.connected;

        for (var client in clients) {
            var client = clients[client];

            if (client.request.session.id !== sid) continue;

            loadSession(sid, function (err, session) {
                if (err) {
                    client.disconnect();
                    return;
                }
                ;

                if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }
                ;

                client.request.session = session;
            });
        };
    });

    io.sockets.on("connection", function (socket) {
        var username = socket.request.user.get("username");

        socket.on("message", function (text, callback) {
            socket.broadcast.emit("message", username, text);
            callback("");
        });
    });

    return io;
};