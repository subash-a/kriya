var https = require("https");
var url = require("url");

function FacebookOAuthClient(clientID, clientSecret, clientVersion, redirectURI) {
	this.clientID = clientID;
	this.clientSecret = clientSecret;
	this.clientVersion = clientVersion;
	this.redirectURI = redirectURI;
	this.access_token = null;
	this.expires = null;
	this.refresh_token = null;
}

FacebookOAuthClient.prototype.generateAuthUrl = function (opts) {
	var options = opts || {};
	var responseType = options.responseType || "code";
	var scopes = options.scopes || ["email", "user_friends", "public_profile"];
	return "https://www.facebook.com/dialog/oauth?client_id=" + this.clientID + "&redirect_uri=" + this.redirectURI + "&responseponse_type=" + responseType + "&scope=" + scopes.join(",");
};

FacebookOAuthClient.prototype.getAccessToken = function (code, callback) {
	var requestOptions = {
		host: "graph.facebook.com",
		path: "/" + this.clientVersion + "/oauth/access_token?client_id=" + this.clientID + "&client_secret=" + this.clientSecret + "&code=" + code + "&redirect_uri=" + this.redirectURI
	};
	var callbackHandler = function (res) {
		var str = "";
		res.on("data", function (d) {
			str = str + d.toString();
		});
		res.on("end", function () {
			try {
				var json = JSON.parse(str);
				callback(undefined, json);
			} catch (err) {
				callback(err, json);
			}
		});
	};
	https.request(requestOptions, callbackHandler).end();
};

FacebookOAuthClient.prototype.setCredentials = function (tokenObject) {
	this.access_token = tokenObject.access_token;
	this.refresh_token = tokenObject.refresh_token;
	this.expires = tokenObject.expires;
};


function Facebook(opts) {
	var options = opts || {};
	var FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
	var FACEBOOK_CLIENT_VERSION = "2.5";
	var FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
	var callbackURL = options.callbackURL || "http://" + process.env.HOSTADDR + ":" + process.env.PORT + "/auth/facebook/callback";
	var scopes = options.scopes;
	var responseType = options.responseType;
	var oauthClient = new FacebookOAuthClient(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_CLIENT_VERSION, callbackURL);
	return {
		redirectToAuthURL: function (request, response) {
			var redirectURL = oauthClient.generateAuthUrl({
				responseType: responseType,
				scopes: scopes
			});
			response.writeHead(302, {
				Location: redirectURL
			});
			response.send();
		},
		fetchAccessToken: function (request, response) {
			var code = url.parse(request.url).query.split("=")[1];
			oauthClient.getAccessToken(code, function (err, tokenObject) {
				if (!err) {
					oauthClient.setCredentials(tokenObject);
					response.writeHead(302, {
						Location: "http://" + process.env.HOSTADDR + ":" + process.env.PORT + "/auth/facebook/done",
						Connection: "keep-alive"
					});
					response.send();
				} else {
					response.send(err);
				}
			});
		},
		finishOAuth: function (request, response) {
			response.send("You are done authorizing Facebook to use Kriya");
		}
	}
}

module.exports = Facebook;