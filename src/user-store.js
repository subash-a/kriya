var mongoose = require("mongoose");

function UserStore(schema) {
	if (!schema) {
		throw new Error("Schema is not defined");
	}
	schema.pre("save", function (next) {
		var user = this;
		if (user.isModified("password")) {
			user.password = "#" + user.password;
		}
		next();
	});

	schema.methods.comparePassword = function (candidate, cb) {
		cb(null, candidate === this.password);
	};

	this.store = mongoose.model("User", schema);
}


UserStore.prototype.createUser = function (userInstance) {
	var newUser = new this.store(userInstance.toJSON());
	return newUser;
};

UserStore.prototype.getUser = function (userInstance) {
	var promise = new Promise(function (resolve, reject) {
		this.store.findOne({
			username: userInstance.username
		}, function (err, userEntry) {
			if (err) {
				reject(err);
			} else {
				if (userEntry) {
					resolve(userEntry);
				} else {
					resolve(null);
				}
			}
		});
	});
	return promise;
};

// Should interface be modify user or save user?
function saveUserEntry(userEntry) {
	var promise = new Promise(function (resolve, reject) {
		userEntry.save(function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
	return promise;
}

UserStore.prototype.save = function (userInstance) {
	return this.getUser(userInstance).then(saveUserEntry);
};


UserStore.prototype.deleteUser = function (userObject) {
	return userObject;
};

module.exports = UserStore;
