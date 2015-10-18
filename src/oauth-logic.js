var https = require("https");
var http = require("http");

var fbConfig = {
	appid: "1658722211069748",
	appsecret:"56ec87e154891b49d599c8041abc88c3",
	version: "2.5"
	redirect_uri:"http://localhost/callback"
};

var oauthRequest = https.request({
	hostname:"graph.facebook.com",
	path:"/v2.5/oauth/access_token"
}, function(response){
	console.log(response);
});

function facebookLogin() {
	var facebookDialog = https.request({
		hostname: "www.facebook.com",
		path: "/dialog/oauth"
	});

	facebookDialog.write("client_id=" + fbConfig.appid + "&redirect_uri=http://localhost/login/");
	facebookDialog.end();
}

module.exports.facebookLogin = facebookLogin;
