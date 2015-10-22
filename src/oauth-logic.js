var https = require("https");
var http = require("http");
var passport = require("passport");
var FacebookStrategy = require("facebook-strategy").Strategy;

var fbStrategy = new FacebookStrategy({
	clientID: "1658722211069748",
	clientSecret: "56ec87e154891b49d599c8041abc88c3",
	callbackURL: "http://localhost:4000/callback",
	enableProof: false
}, function(accessToken, refreshToken, profile, done) {
	console.log(accessToken);
});

passport.use(fbStrategy);

module.exports.passport = passport;
