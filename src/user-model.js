var mongoose = require("mongoose");

function User(username, password, fbAccessToken, googleAccessToken) {
	if (!username) {
		throw new Error("username is missing");
	}
	if (!password) {
		throw new Error("password is missing");
	}
	this.username = username;
	this.password = password;
	this.fbAccessToken = fbAccessToken;
	this.googleAccessToken = googleAccessToken;
}

User.Schema = new mongoose.Schema({
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
	},
	fbAccessToken: {
		type: String,
		required: false
	},
	googleAccessToken: {
		type: String,
		required: false
	}
});

User.prototype.toJSON = function () {
	return {
		username: this.username,
		password: this.password,
		fbAccessToken: this.fbAccessToken,
		googleAccessToken: this.googleAccessToken
	};
};

User.prototype.setUsername = function (username) {
	this.username = username || this.username;
};

User.prototype.setPassword = function (password) {
	this.password = password || this.password;
};

User.prototype.setFbAccessToken = function (accessToken) {
	this.fbAccessToken = accessToken;
};

User.prototype.setGoogleAccessToken = function (accessToken) {
	this.googleAccessToken = accessToken;
};

User.prototype.getUsername = function () {
	return this.username;
};

User.prototype.getPassword = function () {
	return this.password;
};

User.prototype.getFbAccessToken = function () {
	return this.fbAccessToken;
};

User.prototype.getGoogleAccessToken = function () {
	return this.googleAccessToken;
};

// var User = mongoose.model("User", UserSchema);

module.exports = User;