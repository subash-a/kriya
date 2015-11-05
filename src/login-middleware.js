var https = require("https");
var url = require("url");

function Login() {
	return {
		getRoot: function(request, response) {
			var welcomeMessage = {
				"message": "Welcome to Kriya",
				"error": false
			};
			response.send(welcomeMessage);
		},

		getUserLogin: function(request, response) {
			var loginRequestMessage = {
				"message": "",
				"params_required": ["username", "secret", "api_token"],
				error: false
			};
			response.send(loginRequestMessage);
		},

		postUserLogin: function(request, response) {
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
		},

		getRegisterUser: function(request, response) {
			var registrationRequestMessage = {
				"message": "",
				"params_required": ["username", "secret", "api_token"],
				error: false
			};
			response.send(registrationRequestMessage);
		},

		postRegisterUser: function(request, response) {
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
	};
}

module.exports = Login;
