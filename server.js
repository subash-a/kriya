var express = require("express");
var bodyParser = require("body-parser");
var multiParser = require("multer");
var fs = require("fs");
var server = express();

var Suggestions = function() {
    var suggestions = ["no suggestions"];
    return {
	"getSuggestionByIndex":function(index) {
	    if(index) {
		return suggestions[index];
	    }
	    else {
		return suggestions[0];
	    }
	},
	"getSuggestionById": function(id) {
	    return suggestions.filter(function(e){
		if(e.id === parseInt(id,10)) {return e};
	    })[0];
	},
	"load": function(filename) {
	    var onRead = function(err, data) {
		var fileData = JSON.parse(data);
		suggestions = fileData.suggestions;
	    };
	    var datafile = filename || "kriya.json";
	    fs.readFile(datafile, onRead);	    
	},
	"addSuggestion": function(suggestion) {
	    suggestions.push(suggestion);
	},
	"updateSuggestion": function(suggestion) {
	    
	}
    };
};

// Initialize the Suggestion Object
var suggestionSet_1 = new Suggestions();

// Handler functions for the Resources (URL)
server.use(bodyParser.json());
server.use(multiParser());

var getSuggestion = function(request, response) {
    console.log("Request received");
    var userLat = request.params.latitude;
    var userLong = request.params.longitude;
    var utcTime = request.params.utctime;
    var randomInteger = parseInt(Math.random()*10,10);
    var suggestion = suggestionSet_1.getSuggestionByIndex(randomInteger);
    response.send(suggestion);
};

var addSuggestion = function(request, response) {
    console.log(request.body);
    var suggestion = request.body.data;
    if(suggestion) {
	suggestionSet_1.addSuggestion(suggestion);
	response.send("added suggestion");
    }
    else {
	response.send("no suggestion found in data");
    }
};

var updateSuggestion = function(request, response) {
    console.log(request.body);
    console.log(request.body.id);
    response.send("updated suggestion");
};

var getRoot = function(request, response) {
    var sendFileConfig = {"root":__dirname + "/public/"};
    response.sendFile("index.html",sendFileConfig,function(e){
	console.log("served index.html");
    });
};

var getSuggestionDetails = function(request, response) {
    var suggestionId = request.params.id;    
    var suggestion = suggestionSet_1.getSuggestionById(suggestionId);
    response.send(suggestion);
};

server.route("/")
    .get(getRoot);

server.route("/suggestion")
    .get(getSuggestion)
    .post(addSuggestion)
    .put(updateSuggestion);

server.route("/suggestion/:id")
    .get(getSuggestionDetails)

// Setup listener for the server
var serverStartup = function() {
    suggestionSet_1.load("kriya.json");
    console.log("Server started and listening on port 4000");
};

server.listen(4000, serverStartup);
