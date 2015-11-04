var server = require("./src/server");
var dbInterface = require("./src/db-interface");

var localServerConfig = {
	"hostname": process.env.HOSTADDR,
	"port": process.env.PORT,
	"backlog": 100
};

var globalConfiguration = {
	"useDatabase": true
};

var bootstrapActivities = function () {
	if(globalConfiguration.useDatabase) {
		dbInterface.connectToDatabase();
	}
};

server.configureServer(localServerConfig);
server.configureRouter();
server.start(bootstrapActivities);
