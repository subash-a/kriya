var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.pre("save", function (next) {
	var user = this;
	if (user.isModified("password")) {
		user.password = "#" + user.password;
	}
	next();
});

UserSchema.methods.comparePassword = function (candidate, cb) {
	cb(null, candidate === this.password);
};

var User = mongoose.model("User", UserSchema);

module.exports = User;