var https = require("https");
var http = require("http");

function facebookLogin(onResponse) {
	var fbConfig = {
		appid: "1658722211069748",
		appsecret:"56ec87e154891b49d599c8041abc88c3",
		version: "2.5",
		redirect_uri:"http://localhost/callback"
	};

	var facebookDialog = https.request({
		hostname: "graph.facebook.com",
		path: "/v2.5/oauth/access_token"
	}, onResponse);

	facebookDialog.write("client_id=" + fbConfig.appid + "&redirect_uri=http://localhost/login/");
	facebookDialog.end();
}
// access_token: 1658722211069748|u9gOA28IvhAikq6SR8rJswGBu0Q
module.exports.facebookLogin = facebookLogin;
