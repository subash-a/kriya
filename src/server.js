var express = require("express");
var bodyParser = require("body-parser");
var multiParser = require("multer");
var passport = require("passport");

var server = express();
var Router = server.Router();
var hostname, port, backlog;
var defaultHostname = process.env.HOSTADDR;
var defaultPort = process.env.PORT;
var defaultBacklog = 100;

// Handler functions for the Resources (URL)
server.use(bodyParser.json());
server.use(multiParser());
server.use(passport.initialize());

var configureServer = function (config) {
	hostname = config.hostname || defaultHostname;
	port = config.port || defaultPort;
	backlog = config.backlog || deafultBacklog;
};

var start = function (callback) {
	var bootstrapServer = function () {
		if (callback) {
			callback();
		}
		console.log("Server started and listening...");
	};
	server.listen(port, hostname, backlog, bootstrapServer);
}

module.exports.start = start;
module.exports.configureServer = configureServer;
module.exports.Router = Router;
