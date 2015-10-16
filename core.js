var server = require("./src/server");
var router = require("./src/router-config");
var dbInterface = require("./src/db-interface");

var localServerConfig = {
	"hostname": process.env.HOSTADDR,
	"port": process.env.PORT,
	"backlog": 100
};

var bootstrapActivities = function () {
	// dbInterface.connectToDatabase();
};

server.configureServer(localServerConfig);
server.configureRoutes(router.config);
server.start(bootstrapActivities);
