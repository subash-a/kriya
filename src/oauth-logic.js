var https = require("https");
var express = require("express");
var bodyParser = require("body-parser");
var url = require("url");
var AppId = "1658722211069748";
var AppSecret = "56ec87e154891b49d599c8041abc88c3";

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

app.route("/").get(function (req, res) {
	res.write("welcome");
	res.send();
});

app.get("/auth/facebook", function (req, res) {
	res.writeHead(302, {
		Location: "https://www.facebook.com/dialog/oauth?client_id=" + AppId + "&redirect_uri=http://localhost:4000/auth/facebook/callback&response_type=code&scope=email,user_friends,public_profile"
	});
	res.send();
});

var tokenObject = {};

app.get("/auth/facebook/callback", function (req, res) {
	var code = url.parse(req.url).query.split("=")[1];
	getAccessToken(code, function (str) {
		// write the access_token to a db entry and then redirect
		tokenObject = JSON.parse(str);
		res.writeHead(302, {
			Location: "http://localhost:4000/auth/facebook/done",
			Connection: "keep-alive"
		});
		res.send();
	});
});

app.get("/auth/facebook/done", function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html",
		"Connection": "keep-alive"
	});
	res.write("<form action='/my/facebook/info'><button>Me</button></form>")
	res.send();
});

app.get("/my/facebook/info", function (req, res) {
	getFacebookMe(tokenObject, function (details) {
		res.write(details);
	});
	getFacebookFriends(tokenObject, function (details) {
		res.write(details);
		res.send();
	});
});

function getFacebookMe(accessToken, callback) {
	var requestOptions = {
		host: "graph.facebook.com",
		path: "/me?fields=id,name",
		headers: {
			"Authorization": "Bearer " + tokenObject.access_token
		}
	};
	var responseHandler = function (res) {
		var str = "";
		res.on("data", function (d) {
			str = str + d.toString()
		});
		res.on("end", function () {
			callback(str)
		});
	};
	https.request(requestOptions, responseHandler).end();
}

function getFacebookFriends(accessToken, callback) {
	var requestOptions = {
		host: "graph.facebook.com",
		path: "/me/friends?fields=id,name",
		headers: {
			"Authorization": "Bearer " + tokenObject.access_token
		}
	};
	var responseHandler = function (res) {
		var str = "";
		res.on("data", function (d) {
			str = str + d.toString()
		});
		res.on("end", function () {
			callback(str)
		});
	};
	https.request(requestOptions, responseHandler).end();
}

function getAccessToken(code, callback) {
	var requestOptions = {
		host: "graph.facebook.com",
		path: "/v2.3/oauth/access_token?client_id=" + AppId + "&client_secret=" + AppSecret + "&code=" + code + "&redirect_uri=http://localhost:4000/auth/facebook/callback"
	};
	var callbackHandler = function (res) {
		var str = "";
		res.on("data", function (d) {
			str = str + d.toString()
		});
		res.on("end", function () {
			callback(str)
		});
	};
	https.request(requestOptions, callbackHandler).end();
}

app.listen(4000, "localhost");