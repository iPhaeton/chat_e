/**
 * Created by Phaeton on 21.05.2016.
 */
var nconf = require("nconf");
var path = require("path");

nconf.argv()
     .env()
     .file({file: path.join(__dirname, "config.json")});

module.exports = nconf;