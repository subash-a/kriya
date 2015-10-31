var express = require("express");
var dbInterface = require("./db-interface");
var LoginMiddleware = require("./login-middleware");
var FacebookMiddleware = require("./facebook-middleware");
var GoogleMiddleware = require("./google-middleware");
var Router = express.Router();

var login = new LoginMiddleware();
var google = new GoogleMiddleware();
var facebook = new FacebookMiddleware();

Router.get("/", login.getRoot);
Router.get("/auth/login",login.getUserLogin);
Router.post("/auth/login", login.postUserLogin);
Router.get("/auth/register", login.getRegisterUser);
Router.post("/auth/register", login.postRegisterUser);

module.exports = Router;
