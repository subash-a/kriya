var fs = require("fs");

var Activities = function() {
    var activities = ["no activities"];
    return {
	"getActivityByIndex":function(index) {
	    if(index) {
		return activities[index];
	    }
	    else {
		return activities[0];
	    }
	},
	"getActivityById": function(id) {
	    return activities.filter(function(e){
		if(e.id === parseInt(id,10)) {return e};
	    })[0];
	},
	"load": function(filename) {
	    var onRead = function(err, data) {
		var fileData = JSON.parse(data);
		activities = fileData.activities;
	    };
	    var datafile = filename || "kriya.json";
	    fs.readFile(datafile, onRead);	    
	},
	"addActivity": function(activity) {
	    activities.push(activity);
	},
	"updateActivity": function(activity) {
	    
	}
    };
};

module.exports.Activities = Activities
