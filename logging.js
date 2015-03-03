var fs = require("fs");
var buffer = require('buffer');

var Logger = function (filepath) {
    var desc;
    var path = filepath || "logs/default.log";
    var logger = {
	"start": function(error, success) {
	    var callback = function(err,fd) {
		if(err) {
		    error(err);
		}
		else {
		    desc = fd;
		    if(success) {
			success(desc);
		    }
		}
	    };
	    fs.open(filepath,"a", callback);
	},
	"log": function(string, error, success) {
	    var callback = function(err, bytes, data) {
		if(err) {
		    if(error) {
			error(err);
		    }
		}
		else {
		    if(success) {
			success(bytes);
		    }
		}
	    };
	    var buf = new buffer.Buffer(string+"\r\n");
	    console.log(desc);
	    fs.appendFile(path, buf, callback);
	},
	"close": function(error, success) {
	    var callback = function(err) {
		if(err) {
		    if(error) {
			error(err);
		    }
		}
		else {
		    if(success) {
			success();
		    }
		}
	    };
	    fs.close(desc, callback);
	}
    };
    return logger;
};

module.exports.Logger = Logger;
