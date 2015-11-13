var User = require("../src/user-model");

describe("User", function() {
	describe("Constructor", function(){

		it("should throw error if username is not specified", function(){
			expect(function(){return new User(undefined, "password")}).toThrow();
		});

		it("should throw error if password is not specified", function(){
			expect(function(){return new User("subash", undefined)}).toThrow();
		});

		it("should not throw error when access tokens are not passed in", function(){
			expect(function(){return new User("subhash","password","ABCD","EFGH")}).not.toThrow();
		});

		it("should create new User instance", function() {
			expect(function(){return new User("subhash", "password")}).not.toThrow();
		});

	});

	describe("Setters", function() {
		it("should set username correctly", function() {
			var u = new User("user1", "password");
			expect(u.getUsername()).toBe("user1");
			u.setUsername("user0");
			expect(u.getUsername()).toBe("user0");
		});
	});

	describe("Getters", function() {
		it("should get password correctly", function() {
			var u = new User("user1", "password");
			expect(u.getUsername()).toBe("user1");
		});
	});
});
