var User = require("./user-model");
var UserStore = require("./user-store");
var dbInterface = require("./db-interface");

function Login() {
	return {
		getRoot: function (request, response) {
			var welcomeMessage = {
				"message": "Welcome to Kriya",
				"error": false
			};
			response.send(welcomeMessage);
		},

		getUserLogin: function (request, response) {
			var loginRequestMessage = {
				"message": "",
				"params_required": ["username", "secret", "api_token"],
				error: false
			};
			response.send(loginRequestMessage);
		},

		postUserLogin: function (request, response) {
			var body = "";
			var loginResponse = {
				message: "",
				error: false
			};
			request.on("data", function (data) {
				body = body + data;
			});
			request.on("end", function () {
				body = JSON.parse(body.toString());
				if (!body.username || !body.secret || !body.token) {
					console.log(body);
					loginResponse.message = "Missing parameters for login";
					loginResponse.error = true;
					response.send(loginResponse)
				} else {
					console.log(body);
					response.send(loginResponse);
					// validate pasword and send response

				}
			});
		},

		getRegisterUser: function (request, response) {
			var registrationRequestMessage = {
				"message": "",
				"params_required": ["username", "secret", "api_token"],
				error: false
			};
			response.send(registrationRequestMessage);
		},

		postRegisterUser: function (request, response) {
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
				//
				response.send(registrationResponse);
			}
		}
	};
}

module.exports = Login;