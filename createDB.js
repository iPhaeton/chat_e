/**
 * Created by Phaeton on 26.05.2016.
 */

var mongoose = require("libs/mongoose");
    mongoose.set("debug", true);
var async = require("async");

function open(callback) {
    mongoose.connection.on("open", function (err) {
        callback(err, "Datatbase is opened");
    });
};

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
};

function requireModels(callback) {
    require("models/user").User;

    async.each(Object.keys(mongoose.models), function (model, callback) {
        mongoose.models[model].ensureIndexes(callback);
    }, callback);
};

function createUsers(callback) {
    var users = [
        {username: "Alice", password: "111"},
        {username: "Alice", password: "222"},
        {username: "Mark", password: "333"},
    ];

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(function (err) {
            if (err) console.log(err.message);
            else console.log(user);
            callback();
        });
    }, callback);
};

//execution
async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
],
function (err, results) {
    console.log(arguments);
    mongoose.disconnect(function (err) {
        if (err) throw err;
        console.log("Connection is closed");
    });
});