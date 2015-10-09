var server = require("./server");

var getRoot = function(request, response) {
    var welcomeMessage = {"message":"Welcome to Kriya","error":""};
    response.send(welcomeMessage);
};
var routerConfig = {
    "/": {
    	"get":getRoot
    },
};

var serverConfig = {
    "hostname": "localhost",
    "port": 4000,
    "backlog": 100
};

var bootstrapActivities = function() {
};

server.configureServer(serverConfig);
server.configureRoutes(routerConfig);
server.start(bootstrapActivities);
