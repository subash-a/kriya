var fs = require("fs");
var readline = require("readline");

var cmdline = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

var convertObjectToCSVRow = function(object) {
    var keyList = Object.keys(object).sort();
	return keyList.map(function(k){
	    return object[k];
	}).join(",") + "\n";
};

var logFeedback = function(feedback,callback) {
    var afterWrite = function(err) {
	if(!err) {
	    if(callback) {
		callback(feedback);
	    }
	}
    };
    fs.appendFile("mclearn.fbk",convertObjectToCSVRow(feedback),afterWrite);
};

var getSuggestion = function(suggestions,method) {
    var suggestionIndex, response;
    switch(method) {
    case "RANDOM":
	//Fallthrough
    default:
	suggestionIndex = parseInt(Math.random()*10,10);
	response = suggestions[suggestionIndex].suggestion;
	break;
    }
    return response
};

var onRead = function(err, data) {
    var fileData = JSON.parse(data);
    var suggestions = fileData.suggestions;
    var previousSuggestion = null;
    console.log("Hi, I am Qua your task suggestion companion");
    cmdline.setPrompt("You: ");
    cmdline.prompt(true);
    var showPrompt = function(response) {
	console.log("Qua: "+response);
	cmdline.prompt(true);
    };
    var analyzeReply = function(text, callback) {
	var response = getSuggestion(suggestions,method);
	if(previousSuggestion !== null) {
	    previousSuggestion.feedback = text;
	    previousSuggestion.timestamp = (new Date()).toString();
	    previousSuggestion.location = "20.345:30.567";
	    logFeedback(previousSuggestion,function(e){});
	}
	previousSuggestion = suggestions[suggestionIndex];
	if(callback) {
	    callback(response);	    
	}
    };
    var processReply = function(e) {
	switch(e) {
	case "bye": cmdline.close();
	    break;
	default: analyzeReply(e,showPrompt);
	    break;
	}
    };
    cmdline.on("line",processReply);
};

var requestProcessor = function(request) {
    console.log(JSON.stringify(request));
};

var startApplication = function(filename) { 
    fs.readFile("mclearn.json",onRead);
};


module.exports.startApplication = startApplication;
