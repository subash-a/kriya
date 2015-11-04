var Router = require("./server").Router;
var dbInterface = require("./db-interface");
var LoginMiddleware = require("./login-middleware");
var FacebookMiddleware = require("./facebook-middleware");
var GoogleMiddleware = require("./google-middleware");

function configureRouter() {
	Router.get("/", LoginMiddleware.getRoot);
	Router.get("/auth/login/",LoginMiddleware.getUserLogin);
}

module.exports.configureRouter = configureRouter;
