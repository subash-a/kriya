var server = require("./src/server");
var router = require("./src/router-config");
var dbInterface = require("./src/db-interface");

var serverConfig = {
	"hostname": "localhost",
	"port": 4000,
	"backlog": 100
};

var bootstrapActivities = function () {
	dbInterface.connectToDatabase();
};

server.configureServer(serverConfig);
server.configureRoutes(router.config);
server.start(bootstrapActivities);
