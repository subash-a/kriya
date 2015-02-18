var server = require("./server");
var activities = require("./activities");

// Initialize the Activity Object
var activitiesSet_1 = new activities.Activities();

var getActivity = function(request, response) {
    console.log("Request received");
    var userLat = request.params.latitude;
    var userLong = request.params.longitude;
    var utcTime = request.params.utctime;
    var randomInteger = parseInt(Math.random()*10,10);
    var activity = activitiesSet_1.getActivityByIndex(randomInteger);
    response.send(activity);
};

var addActivity = function(request, response) {
    console.log(request.body);
    var activity = request.body.data;
    if(activity) {
	activitiesSet_1.addActivity(activity);
	response.send("added activity");
    }
    else {
	response.send("no activity found in data");
    }
};

var updateActivity = function(request, response) {
    console.log(request.body);
    console.log(request.body.id);
    response.send("updated activity");
};

var getRoot = function(request, response) {
    var welcomeMessage = {"message":"Welcome to Kriya","error":""};
    response.send(welcomeMessage);
};

var getActivityDetails = function(request, response) {
    var activityId = request.params.id;    
    var activity = activitiesSet_1.getActivityById(activityId);
    response.send(activity);
};

var routerConfig = {
    "/": {
    	"get":getRoot
    },
    "/activity": {
	"get":getActivity,
	"post":addActivity,
	"put":updateActivity
    },
    "/activity/:id": {
	"get":getActivityDetails
    }
};

var serverConfig = {
    "hostname": "localhost",
    "port": 4000,
    "backlog": 100
};

var bootstrapActivities = function() {
    activitiesSet_1.load("kriya.json");
    console.log("loaded kriya dataset");
};
server.configureServer(serverConfig);
server.configureRoutes(routerConfig);
server.start(bootstrapActivities);
