var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var AppId = "1658722211069748";
var AppVersion = "2.5";
var AppSecret = "56ec87e154891b49d599c8041abc88c3";

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: AppId,
	clientSecret: AppSecret,
	callbackURL: "http://127.0.0.1:4000/auth/facebook/callback",
	proof: false
}, function(accessToken, refreshToken, profile, done) {
	return done(null, profile);
}));

app.route("/").get(function(req, res){
	res.write("welcome");
	res.send();
});

app.get("/auth/facebook", passport.authenticate("facebook"));
// function(req, res) {
// 	console.log(req.body);
// 	res.send();
// });

app.get("/auth/facebook/callback", passport.authenticate("facebook"), function(req, res) {
	console.log(req);
	res.send();
});


app.listen(4000, "localhost");
