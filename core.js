var server = require("./server");
var activities = require("./activities");
var logging = require("./logging");

// Initialize the Activity Object
var activitiesSet_1 = new activities.Activities();
// Initialize the logging object
var logFile = "logs/kriya.log";
var logger = new logging.Logger(logFile);

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

var upvoteActivity = function(request, response) {
    var activityId = request.params.id;
    var activity = activitiesSet_1.getActivityById(activityId);
    var onLogSuccess = function() {
	response.send("upvoted activity");
    };
    var onLogError = function() {
	response.send("upvoting unsuccessful");
    };
    logger.log(JSON.stringify(activity),onLogError,onLogSuccess);
};

var downvoteActivity = function(request, response) {
    var activityId = request.params.id;
    var activity = activitiesSet_1.getActivityById(activityId);
        var onLogSuccess = function() {
	response.send("downvoted activity");
    };
    var onLogError = function() {
	response.send("downvoting unsuccessful");
    };
    logger.log(JSON.stringify(activity),onLogError,onLogSuccess);
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
    },
    "/activity/upvote/:id": {
	"post": upvoteActivity
    },
    "/activity/downvote/:id": {
	"post": downvoteActivity
    }
};

var serverConfig = {
    "hostname": "localhost",
    "port": 4000,
    "backlog": 100
};

var bootstrapActivities = function() {
    var loadSuccess = function() {
	console.log("loaded kriya dataset");
    };
    var loadError = function(e) {
	console.log("could not load kriya dataset");
	console.log(e);
    };
    var logStartSuccess = function(d) {
	console.log("started logging",d);
    };
    var logStartError = function(e) {
	console.log("could not start logging");
	console.log(e);
    };
    activitiesSet_1.load("kriya.json",loadError,loadSuccess);
    logger.start(logStartError,logStartSuccess);
};

server.configureServer(serverConfig);
server.configureRoutes(routerConfig);
server.start(bootstrapActivities);
