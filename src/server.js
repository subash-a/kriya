var express = require("express");
var bodyParser = require("body-parser");
var multiParser = require("multer");
var server = express();
var hostname, port, backlog;
var defaultHostname = "localhost";
var defaultPort = 4000;
var defaultBacklog = 100;

// Handler functions for the Resources (URL)
server.use(bodyParser.json());
server.use(multiParser());


var configureRoutes = function (config) {
	var routes = Object.keys(config);
	var assignHandlers = function (uri) {
		var route = server.route(uri);
		var methods = config[uri];
		var assignMethods = function (m) {
			route[m](methods[m]);
		};
		Object.keys(methods)
			.map(assignMethods);
	};
	routes.map(assignHandlers);
};

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
module.exports.configureRoutes = configureRoutes;
