var express = require("express");
var bodyParser = require("body-parser");
var multiParser = require("multer");
var fs = require("fs");
var server = express();

var Suggestions = function() {
    var suggestions = ["no suggestions"];
    return {
	"getSuggestion":function(index) {
	    if(index) {
		return suggestions[index];
	    }
	    else {
		return suggestions[0];
	    }
	},
	"load": function(filename) {
	    var onRead = function(err, data) {
		var fileData = JSON.parse(data);
		suggestions = fileData.suggestions;
	    };
	    var datafile = filename || "mclearn.json";
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
    var randomInteger = parseInt(Math.random()*10,10);
    response.send(suggestionSet_1.getSuggestion(randomInteger));
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
    response.send("updated suggestion");
};

server.route("/suggestion")
    .get(getSuggestion)
    .post(addSuggestion)
    .put(updateSuggestion);

// Setup listener for the server
var serverStartup = function() {
    suggestionSet_1.load("mclearn.json");
    console.log("Server started and listening on port 4000");
};

server.listen(4000, serverStartup);
