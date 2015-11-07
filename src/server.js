var express = require("express");
var bodyParser = require("body-parser");
var multiParser = require("multer");
var passport = require("passport");
var router = require("./router-config");
var server = express();

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
	backlog = config.backlog || defaultBacklog;
};

var configureRouter = function () {
	server.use(router);
};

var start = function (callback) {
	var bootstrapServer = function () {
		if (callback) {
			callback();
		}
		process.stdout.write("Started server and listening...\n");
	};
	server.listen(port, hostname, backlog, bootstrapServer);
}

module.exports.start = start;
module.exports.configureServer = configureServer;
module.exports.configureRouter = configureRouter;