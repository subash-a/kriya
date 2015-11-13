var mongoose = require("mongoose");
var UserStore = require("../src/user-store");

describe("UserStore", function() {
	var DummySchema = new mongoose.Schema({
		username: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		password: {
			type: String,
			required: true
		}
	});

	describe("Constructor", function() {
		it("should throw error when schema is not provided", function() {
			expect(function(){return new UserStore(undefined)}).toThrow();
		});

		it("should create a new user store instance", function() {
			expect(function(){return new UserStore(DummySchema)}).not.toThrow();
		});
	});

	describe("CreateUser", function() {
		it("should create a new user entry", function() {
			var store = new UserStore(DummySchema);
			// store.createUser();
		});
	});

	describe("GetUser", function() {

	});

	describe("ModifyUser", function() {

	});

	describe("DeleteUser", function() {

	});
});
