var htmlparser = require("htmlparser2");

function ParserState() {
	var state = [];
	return {
		push: function(value){
			return state.push(value);
		},
		getCurrentState: function(){
			var counter = state.length;
			while(counter > 0 && state[counter] !== "no-class") {
				counter--;
			}
			return state[counter];
		},
		getStatePath: function() {
			var pathArray = state.filter(function(s){return s!== "no-class"});
			return pathArray;
		},
		contains: function(value) {
			return state.indexOf(value) !== -1;
		},
		pop: function(){
			return state.pop();
		}
	}
}

function MovieDataParser() {
	var state = ParserState();
	var result = {};
	var theaterIndex = 0;
	var movieIndex = 0;
	var textBuffer;
	this.json = result;
	this.parser = new htmlparser.Parser({
		onopentag: function(tagname, attrib) {
			switch(attrib.class) {
			case "movie_results":
				state.push(attrib.class);
				result["theaters"] = [];
				break;
			case "theater":
				state.push(attrib.class);
				result["theaters"][theaterIndex] = {};
				break;
			case "desc":
				state.push(attrib.class);
				result["theaters"][theaterIndex]["desc"] = {};
				break;
			case "name":
				state.push(attrib.class);
				if(tagname === "div") {
					result["theaters"][theaterIndex]["movies"][movieIndex]["name"] = null;
				} else if(tagname === "h2") {
					result["theaters"][theaterIndex]["desc"]["name"] = null;
				} else {
					// do nothing
				}
				break;
			case "info":
				state.push(attrib.class);
				if(tagname === "span") {
					result["theaters"][theaterIndex]["movies"][movieIndex]["info"] = null;
				} else if(tagname === "div") {
					result["theaters"][theaterIndex]["desc"]["info"] = null;
				} else {
					// do nothing
				}
				break;
			case "showtimes":
				state.push(attrib.class);
				result["theaters"][theaterIndex]["movies"] = [];
				break;
			case "movie":
				state.push(attrib.class);
				result["theaters"][theaterIndex]["movies"][movieIndex] = {};
				break;
			case "times":
				state.push(attrib.class);
				result["theaters"][theaterIndex]["movies"][movieIndex]["times"] = [];
				break;
			default:
				state.push("no-class");
				break;
			}
		},
		ontext: function(text) {
			if(state.contains("times")) {
				textBuffer += text;
			} else {
				textBuffer = text;
			}
		},
		onclosetag: function(tagname) {
			switch(state.pop()) {
			case "theater":
				theaterIndex ++;
				break;
			case "name":
				if(tagname === "h2") {
					result["theaters"][theaterIndex]["desc"]["name"] = textBuffer;
				} else if(tagname === "div") {
					result["theaters"][theaterIndex]["movies"][movieIndex]["name"] = textBuffer;
				} else {
					// do nothing
				}
				textBuffer = "";
				break;
			case "info":
				if(tagname === "span") {
					result["theaters"][theaterIndex]["movies"][movieIndex]["info"] = textBuffer;
				} else if(tagname === "div"){
					result["theaters"][theaterIndex]["desc"]["info"] = textBuffer;
				} else {
					// do nothing
				}
				textBuffer = "";
				break;
			case "movie":
				movieIndex++;
				break;
			case "times":
				result["theaters"][theaterIndex]["movies"][movieIndex]["times"].push(textBuffer);
				textBuffer = "";
				break;
			case "movie_results":
				break;
			default:
				break;
			}
		},
		onend: function() {

		}
	}, {decodeEntities: true});
}

function cleanData(raw) {
	var tabReg = /\t+/g;
	var newlineReg = /\n+/g;
	var spaceReg = /&nbsp;+/g;
	var otherReg = /&lrm;+/g;
	var ampReg = /&amp;/g;
	var clean = raw.replace(tabReg, "")
		.replace(newlineReg, "")
		.replace(spaceReg, " ")
		.replace(ampReg, "&")
		.replace(otherReg, "");
	return clean;
}

MovieDataParser.prototype.parse = function(markup) {
	this.parser.write(cleanData(markup));
	this.parser.end();
	return JSON.stringify(this.json);
}

module.exports = MovieDataParser;
