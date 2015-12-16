var http = require("http");

function MovieStore() {

}

MovieStore.prototype.getMovies = function (request, response) {
	var requestOptions = {
		hostname: "www.google.co.in",
		path: "/movies"
	};
	http.request(requestOptions, function (response0) {
		var movieData = "";
		response0.on("data", function (data) {
			movieData = movieData + data.toString();
		});
		response0.on("end", function () {
			response.send(movieData);
		});
	}).end();
};

module.exports = MovieStore;
