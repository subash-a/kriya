var https = require("https");
var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var url = require("url");
var FacebookStrategy = require("passport-facebook").Strategy;
var AppId = "1658722211069748";
var AppVersion = "2.5";
var AppSecret = "56ec87e154891b49d599c8041abc88c3";

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

app.route("/").get(function(req, res){
	res.write("welcome");
	res.send();
});

app.get("/auth/facebook", function(req, res) {
	res.writeHead(302, {
		Location: "https://www.facebook.com/dialog/oauth?client_id="+AppId+"&redirect_uri=http://localhost:4000/auth/facebook/callback&response_type=code"
	});
	res.send();
});

var calledOnce = false;
var tokenObject = {};
app.get("/auth/facebook/callback", function(req, res) {
	var code = url.parse(req.url).query.split("=")[1];
	getAccessToken(code, function(str){
		// write the access_token to a db entry and then redirect
		tokenObject = JSON.parse(str);
		res.writeHead(302, {
			Location: "http://localhost:4000/auth/facebook/done"
		});
		res.send();
	});
});

app.get("/auth/facebook/done", function(req, res) {
	res.send(tokenObject);
});

function getAccessToken(code, callback) {
	var requestOptions = {
		host: "graph.facebook.com",
		path: "/v2.3/oauth/access_token?client_id="+AppId+"&client_secret="+AppSecret+"&code="+code+"&redirect_uri=http://localhost:4000/auth/facebook/callback"
	};
	var callbackHandler = function(res) {
		var str = "";
		res.on("data", function(d){str = str + d.toString()});
		res.on("end", function(d){callback(str)});
	};
	https.request(requestOptions, callbackHandler).end();
}

app.listen(4000, "localhost");
