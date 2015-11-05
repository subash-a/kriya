var googleapis = require("googleapis");
var url = require("url");
var oauth2 = googleapis.auth.OAuth2;


function Google(opts) {
	var options = opts || {};
	var callbackURL = options.callbackURL || "http://localhost:4000/auth/google/callback";
	var accessType = options.accessType || "online";
	var GOOGLE_CLIENT_ID = "403488058074-r54g9s3qb123gn706im8br42nbnc142b.apps.googleusercontent.com";
	var GOOGLE_CLIENT_SECRET = "CJ0o6Dyd3s9sqpmytKY3Hb6m";
	var SCOPES = [
		"https://www.googleapis.com/auth/plus.me",
		"https://www.googleapis.com/auth/calendar"
	];
	var oauthClient = new oauth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, callbackURL);
	var authCode;
	return {
		redirectAuthURL: function (request, response) {
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
						Location: "http://localhost:4000/auth/google/done"
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
