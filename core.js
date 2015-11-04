var server = require("./src/server");
var router = require("./src/router-config");
var dbInterface = require("./src/db-interface");

var localServerConfig = {
	"hostname": process.env.HOSTADDR,
	"port": process.env.PORT,
	"backlog": 100
};

var bootstrapActivities = function () {
	dbInterface.connectToDatabase();
};

server.configureServer(localServerConfig);
router.configureRouter();
server.start(bootstrapActivities);

/**
AppId: 1658722211069748
Version: 2.5
AppSecret: 56ec87e154891b49d599c8041abc88c3
**/
