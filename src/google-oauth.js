var https = require("https");
var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");

var googleapis = require("googleapis");
var oauth2 = googleapis.auth.OAuth2;

var googleClientID = "403488058074-r54g9s3qb123gn706im8br42nbnc142b.apps.googleusercontent.com";
var googleClientSecret = "CJ0o6Dyd3s9sqpmytKY3Hb6m";

var oauthClient = new oauth2(googleClientID, googleClientSecret, "http://localhost:4000/auth/google/callback");
var scopes = [
	"https://www.googleapis.com/auth/plus.me",
	"https://www.googleapis.com/auth/calendar"
];

var app = express();
app.use(bodyParser.json());

app.get("/", function(req, res) {
	res.send("Welcome to google auth");
});

app.get("/auth/google", function(req, res) {
	var redirectURL = oauthClient.generateAuthUrl({
		access_type: "online",
		scope: scopes
	});
	res.writeHead(302, {
		Location: redirectURL
	});
	res.send();
});

app.get("/auth/google/callback", function(req, res) {
	var code = url.parse(req.url).query.split("=")[1];
	oauthClient.getToken(code, function(err, tokens) {
		if(!err) {
			oauthClient.setCredentials(tokens);
			res.send(tokens);
		} else {
			res.send(err);
		}
	});
});

app.listen(4000, "localhost");
