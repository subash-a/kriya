var Parser = require("../lib/movie-data-parser");
var fs = require("fs");

describe("Parser", function() {

	var parser;

	beforeEach(function(){
		parser = new Parser();
	});

	it("should parse without error", function(done) {
		var sampleMarkup1 = fs.readFile("spec/fixtures/sample-markup.html", function(err, data) {
			if(err) {
				throw err;
			}
			expect(function(){parser.parse(data.toString())}).not.toThrow();
			done();
		});
	});

	describe("with a valid html file", function() {
		var parserOutput;

		beforeEach(function(done){
			var sampleMarkup1 = fs.readFile("spec/fixtures/sample-markup.html", function(err, data) {
				if(err) {
					throw err;
				}
				parserOutput = parser.parse(data.toString());
				done();
			});
		});

		it("should return a string which parses to valid JSON", () => {
			expect(function(){return JSON.parse(parserOutput)}).not.toThrow();
		});

		describe("with a valid JSON", function() {
			var parsedJSON;

			beforeEach(function() {
				parsedJSON = JSON.parse(parserOutput);
			});

			it("should have the list of theaters", function() {
				expect(parsedJSON.theaters).toBeDefined();
				expect(parsedJSON.theaters.length).not.toBe(0);
				expect(parsedJSON.theaters[0]).toBeDefined();
			});

			it("should have the description of the theater", function() {
				expect(parsedJSON.theaters[0].desc).toBeDefined();
				expect(parsedJSON.theaters[0].desc.name).toBeDefined();
				expect(parsedJSON.theaters[0].desc.name).toEqual("PVR Arena Mall");
				expect(parsedJSON.theaters[0].desc.info).toBeDefined();
				expect(parsedJSON.theaters[0].desc.info).toEqual("Soul Space Arena Mall - 5th Floor - Bellandur Junction - Marthalli Outer Ring Road - Bellandur, Bangalore - 080 4919 2800");
			});

			it("should have the list of movies", function() {
				expect(parsedJSON.theaters[0].movies).toBeDefined();
				expect(parsedJSON.theaters[0].movies.length).not.toBe(0);
			});

			it("should have details of the movie", function() {
				expect(parsedJSON.theaters[0].movies[0].name).toBeDefined();
				expect(parsedJSON.theaters[0].movies[0].name).toBe("Tamasha");
				expect(parsedJSON.theaters[0].movies[0].info).toBeDefined();
				expect(parsedJSON.theaters[0].movies[0].info).toBe("2hr 35min - Romance/Drama - Hindi");
				expect(parsedJSON.theaters[0].movies[0].times).toBeDefined();
				expect(parsedJSON.theaters[0].movies[0].times.length).not.toBe(0);
				expect(parsedJSON.theaters[0].movies[0].times[0]).toBe("9:00  10:00am  12:00  1:00  3:00  3:30  4:00  6:00  7:00  9:30  10:00pm");
			});
		});
	});
});
