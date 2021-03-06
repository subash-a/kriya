var express = require("express");
var LoginMiddleware = require("./login-middleware");
var FacebookMiddleware = require("./facebook-middleware");
var GoogleMiddleware = require("./google-middleware");
var MovieStore = require("./movie-middleware");
var Router = express.Router();

var login = new LoginMiddleware();
var google = new GoogleMiddleware();
var facebook = new FacebookMiddleware();
var movies = new MovieStore();

Router.get("/", login.getRoot);

/* Login and Registration routes */
Router.get("/auth/login", login.getUserLogin);
Router.post("/auth/login", login.postUserLogin);
Router.get("/auth/register", login.getRegisterUser);
Router.post("/auth/register", login.postRegisterUser);

/* Facebook oAuth Login routes */
Router.get("/auth/facebook/", facebook.redirectToAuthURL);
Router.get("/auth/facebook/callback", facebook.fetchAccessToken);
Router.get("/auth/facebook/done", facebook.finishOAuth);

/* Google oauth login routes */
Router.get("/auth/google/", google.redirectToAuthURL);
Router.get("/auth/google/callback", google.fetchAuthCode, google.fetchAccessToken);
Router.get("/auth/google/done", google.finishOAuth);

/* Movie Show timings */
Router.get("/movies", movies.getMovies);

module.exports = Router;