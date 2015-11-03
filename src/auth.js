var https = require("https");
var url = require("url");

function Login() {
	return function(request, response) {
		response.send("You are now logged in!");
	};
}
