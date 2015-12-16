var mongoose = require("mongoose");

function Database() {
	this.connected = false;
}

Database.prototype.connect = function (connectionString) {
	var instance = this;
	var promise = new Promise(function (resolve, reject) {
		mongoose.connect(connectionString, function (err) {
			if (err) {
				reject(err);
			} else {
				instance.connected = true;
				process.stdout.write("connected to MongoDB successfully...\n");
				resolve(true);
			}
		});
	});
	return promise;
}

Database.prototype.disconnect = function () {
	mongoose.disconnect();
	this.connected = false;
	return true;
}
