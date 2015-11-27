/*
 * This is an improvement to generate parsers on the go for different
 * types of structured HTML content. This will be completed in another
 * PR.
 */
var fs = require("fs");
var process = require("process");

var config = {
	"name": "theaters",
	"key":"movie_results",
	"attribute": "class",
	"type":"list",
	"tagType": "div",
	"hasChildren": true,
	"children":[
		{
			"name": "theater",
			"key": "theater",
			"attribute": "class",
			"type": "object",
			"tagType":"div",
			"hasChildren": true,
			"children": [
				{
					"name": "description",
					"key":"desc",
					"attribute": "class",
					"type": "object",
					"tagType":"div",
					"hasChildren": true,
					"children": [
						{
							"name":"name",
							"key":"name",
							"attribute": "class",
							"type": "string",
							"tagType": "h2",
							"hasChildren": false
						},
						{
							"name":"info",
							"key": "info",
							"attribute": "class",
							"type": "string",
							"tagType": "div",
							"hasChildren": false
						}
					]
				}
			]
		}
	]
}

writeParserIntoFile("gen/sample_parser.js", generateParser(config));

function writeParserIntoFile(filename, data) {
	fs.open(filename, "w", function(err, fdesc) {
		if(err) {
			process.stderr.write(err.toString());
		} else {
			fs.write(fdesc, data, "utf8", function(err) {
				if(err) {
					process.stdout.write("dumb asshole you dont know how to code!");
					process.stderr.write(err.toString());
				} else {
					process.stdout.write("i am impressed");
				}
			});
		}
	});
}

function generateParser(configuration) {
	var parser = `
	${generateVariables(configuration)}
	this.parser = new htmlparser.Parser({
	onopentag: function(tagname, attrib) {
		${generateOpenTags(configuration)}
	},
	ontext: function(text) {
		${generateTextTags(configuration)}
	},
	onclosetag: function(tagname) {
		${generateCloseTags(configuration)}
	}});
	`;
	return parser;
}

function generateVariables(cobj) {
	var varstring;
	switch(cobj.type) {
	case "list":
		varstring = `var ${cobj.name.substring(0, (cobj.name.length-1))}Index = 0;`;
		break;
	case "string":
		varstring = `var ${cobj.name}String;`;
		break;
	default: break;
	}
	if(cobj.hasChildren) {
		varstring += cobj.children.map(function(c){
			return generateVariables(c);
		}).join("\n");
	}
	return varstring;
}

function generateOpenTags(configuration) {
	var code = `
	switch(attrib.class) {
		${processOpenTagNode(configuration)}
	default: break;
	}
	`;
	return code;
}

function generateTextTags() {

}

function generateCloseTags(configuration) {
	var code = `
	switch(state.pop()) {
		${processCloseTagNode(configuration)}
	default: break;
	}
	`;
	return code;
}

function processOpenTagNode(obj) {
	var codestring = generateOpenTagCaseStatements(obj);
	if(obj.hasChildren) {
		codestring += obj.children.map(function(cobj){
			return processOpenTagNode(cobj);
		}).join("");
	}
	return codestring;
}

function processCloseTagNode(obj) {
	var codestring = generateCloseTagCaseStatements(obj);
	if(obj.hasChildren) {
		codestring += obj.children.map(function(cobj){
			return processCloseTagNode(cobj);
		}).join("");
	}
	return codestring;
}

function generateOpenTagCaseStatements(object) {
	var codestring = `
	case "${object.key}":
	state.push(attrib.${object.attribute});
	if(tagname === "${object.tagType}") {
		result["${object.name}"] = ${getAppropriateType(object.type)};
	}
	break;
	`;
	return codestring;
}

function getAppropriatePath() {

}

function getAppropriateType(type) {
	var inf;
	switch(type) {
	case "list":
		inf = "[]";
		break;
	case "object":
		inf = "{}";
		break;
	case "string":
		inf = "null";
		break;
	default: break;
	}
	return inf;
}

function generateCloseTagCaseStatements(object) {
	var codestring = `
	case "${object.key}":
	state.push(attrib.${object.attribute});
	result["${object.name}"] = ${object.type === "list" ? "[]" : "{}"};
	break;
	`;
	return codestring;
}
