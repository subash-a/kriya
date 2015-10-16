var server = require("./src/server");
var router = require("./src/router-config");
var dbInterface = require("./src/db-interface");

var localServerConfig = {
	"hostname": "localhost",
	"port": 80,
	"backlog": 100
};

var herokuServerConfig = {
	"hostname": "https://agile-reaches-6281.herokuapp.com",
	"port": 80,
	"backlog": 100
}

var bootstrapActivities = function () {
	dbInterface.connectToDatabase();
};

server.configureServer(herokuServerConfig);
server.configureRoutes(router.config);
server.start(bootstrapActivities);
