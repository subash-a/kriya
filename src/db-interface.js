var mongoose = require("mongoose");
var User = require("./user-model");

function connectToDatabase() {
	return new Promise(function (resolve, reject) {
		mongoose.connect(process.env.DB_CONNECTION_STRING, function (err) {
			if (err) {
				reject(err);
			} else {
				process.stdout.write("connected to MongoDB successfully...\n");
				resolve(true);
			}
		});
	});
}

function createNewUser(userObject) {
	return new Promise(function (resolve, reject) {
		var newUser = new User(userObject);
		newUser.save(function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

function getUser(userObject) {
	return new Promise(function (resolve, reject) {
		User.findOne({
			username: userObject.username
		}, function (err, user) {
			if (err) {
				reject(err);
			} else {
				if (user) {
					resolve(user);
				} else {
					resolve(null);
				}
			}
		});
	});
}

function doesUserExist(userObject) {
	return getUser(userObject)
		.then(function (user) {
			if (user) {
				Promise.resolve(true);
			} else {
				Promise.resolve(false);
			}
		});
}

function registerUser(userObject) {
	return doesUserExist(userObject)
		.then(function (userExists) {
			if (!userExists) {
				return createNewUser(userObject);
			} else {
				return Promise.resolve(false);
			}
		});
}

function validatePassword(user, password) {
	return new Promise(function (resolve, reject) {
		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				reject(err);
			} else {
				resolve(isMatch);
			}
		});
	});
}

function validateCredentials(userObject) {
	return getUser(userObject)
		.then(function (user) {
			return validatePassword(user, userObject.password)
		});
}

module.exports.validateCredentials = validateCredentials;
module.exports.registerUser = registerUser;
module.exports.connectToDatabase = connectToDatabase;
