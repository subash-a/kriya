function FacebookOAuthClient(clientID, clientSecret, redirectURI) {
	this.clientID = clientID;
	this.clientSecret = clientSecret;
	this.redirectURI = redirectURI;
	this.access_token = null;
	this.expires = null;
	this.refresh_token = null;
	return {
		generateAuthUrl: function (opts) {
			var options = opts || {};
			var responseType = options.responseType || "code";
			var scopes = options.scopes || ["email", "user_friends", "public_profile"];
			return "https://www.facebook.com/dialog/oauth?client_id=" + this.clientID + "&redirect_uri=" + this.redirectURI + "&responseponse_type=" + responseType + "&scope=" + scopes.join(",");
		},
		getAccessToken: function (code, callback) {
			var requestOptions = {
				host: "graph.facebook.com",
				path: "/v2.3/oauth/access_token?client_id=" + this.clientID + "&client_secret=" + this.clientSecret + "&code=" + code + "&redirect_uri=" + this.redirectURI
			};
			var callbackHandler = function (res) {
				var str = "";
				res.on("data", function (d) {
					str = str + d.toString();
				});
				res.on("end", function (d) {
					try {
						var json = JSON.parse(str);
						callback(undefined, str);
					} catch (err) {
						callback(err, str);
					}
				});
			};
			https.request(requestOptions, callbackHandler).end();
		},
		setCredentials: function (tokenObject) {
			this.access_token = tokenObject.access_token;
			this.refresh_token = tokenObject.refresh_token;
			this.expires = tokenObject.expires;
		}
	}
}

function Facebook(opts) {
	var options = opts || {};
	var FACEBOOK_CLIENT_ID = "1658722211069748";
	var FACEBOOK_CLIENT_VERSION = "2.5";
	var FACEBOOK_CLIENT_SECRET = "56ec87e154891b49d599c8041abc88c3";
	var callbackURL = options.callbackURL || "http://localhost:4000/auth/facebook/callback";
	var scopes = options.scopes;
	var responseType = options.responseType;
	var oauthClient = new FacebookOAuthClient(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, callbackURL);
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
			var code = url.parse(req.url).query.split("=")[1];
			oauthClient.getAccessToken(code, function (err, tokenObject) {
				if (!err) {
					oauthClient.setCredentials(tokenObject);
					response.writeHead(302, {
						Location: "http://localhost:4000/auth/facebook/done",
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