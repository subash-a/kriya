var dbInterface = require("./db-interface");
var passport = require("./oauth-logic").passport;

function getRoot(request, response) {
	var welcomeMessage = {
		"message": "Welcome to Kriya",
		"error": false
	};
	response.send(welcomeMessage);
}

function getUserLogin(request, response) {
	var loginRequestMessage = {
		"message": "",
		"params_required": ["username", "secret", "api_token"],
		error: false
	};
	response.send(loginRequestMessage);
}

function postUserLogin(request, response) {
	var body = request.body;
	var loginResponse = {
		message: "",
		error: false
	};
	if (!body.username || !body.secret || !body.token) {
		loginResponse.message = "Missing parameters for login";
		loginResponse.error = true;
		response.send(loginResponse)
	} else {
		dbInterface.validateCredentials({
				username: body.username,
				password: body.secret
			})
			.then(function (isValid) {
				if (isValid) {
					loginResponse.message = "Login sucessful";
				} else {
					console.log(isValid);
					loginResponse.message = "Username/Password incorrect";
				}
				response.send(loginResponse);
			});
	}
}

function getRegisterUser(request, response) {
	var registrationRequestMessage = {
		"message": "",
		"params_required": ["username", "secret", "api_token"],
		error: false
	};
	response.send(registrationRequestMessage);
}

function postRegisterUser(request, response) {
	var body = request.body;
	var registrationResponse = {
		message: "",
		error: false
	};
	if (!body.username || !body.secret || !body.token) {
		registrationResponse.message = "Missing parameters for user registration";
		registrationResponse.error = true;
		response.send(registrationResponse)
	} else {
		dbInterface.registerUser({
				username: body.username,
				password: body.secret
			})
			.then(function (isRegistered) {
				if (isRegistered) {
					registrationResponse.message = "Registration sucessful";
				} else {
					registrationResponse.message = "Username already registered";
				}
				response.send(registrationResponse);
			})
			.catch(function (err) {
				registrationResponse.message = "Unexpected failure";
				registrationResponse.error = err;
				response.send(registrationResponse);
			});
	}
}

var authenticateFacebook = function(req, res) {
	passport.authenticate("facebook");
};

var facebookAuthenticated = function(req, res) {
	passport.authenticate("facebook", {failureRedirect: "/"});
};

var config = {
	"/": {
		"get": getRoot
	},
	"/login/": {
		"get": getUserLogin,
		"post": postUserLogin
	},
	"/register/": {
		"get": getRegisterUser,
		"post": postRegisterUser
	},
	"/fblogin/": {
		"get": authenticateFacebook
	},
	"/fblogin/authenticated/": {
		"get": facebookLoginAuthenticated
	}
};

module.exports.config = config;
