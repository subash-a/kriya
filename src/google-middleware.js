var googleapis = require("googleapis");
var url = require("url");
var oauth2 = googleapis.auth.OAuth2;


function Google(opts) {
	var options = opts || {};
	var callbackURL = options.callbackURL || "http://" + process.env.HOSTADDR + ":" + process.env.PORT + "/auth/google/callback";
	var accessType = options.accessType || "online";
	var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
	var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
	var SCOPES = [
		"https://www.googleapis.com/auth/plus.me",
		"https://www.googleapis.com/auth/calendar"
	];
	var oauthClient = new oauth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, callbackURL);
	var authCode;
	return {
		redirectToAuthURL: function (request, response) {
			var redirectURL = oauthClient.generateAuthUrl({
				access_type: accessType,
				scope: SCOPES
			});
			response.writeHead(302, {
				Location: redirectURL
			});
			response.send();
		},
		fetchAuthCode: function (request, response, next) {
			authCode = url.parse(request.url).query.split("=")[1];
			if (authCode) {
				next();
			} else {
				response.send("Invalid code");
			}
		},
		fetchAccessToken: function (request, response) {
			oauthClient.getToken(authCode, function (err, tokens) {
				if (!err) {
					oauthClient.setCredentials(tokens);
					response.writeHead(302, {
						Location: "http://" + process.env.HOSTADDR + ":" + process.env.PORT + "/auth/google/done"
					});
					response.send();
				} else {
					response.send(err);
				}
			});
		},
		finishOAuth: function (request, response) {
			response.send("You are done authorizing Google to use Kriya");
		}
	};
}

module.exports = Google;