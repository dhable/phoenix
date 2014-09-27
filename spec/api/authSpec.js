var auth = require("../../lib/api/auth.js");


describe("The API auth module", function() {

    describe("validateUserAuthInput function", function() {
        var logSpy, nextSpy;

        beforeEach(function() {
            logSpy = jasmine.createSpyObj("logger", ["debug"]);
            nextSpy = jasmine.createSpy("next");
        });

        it("should return an error if the body is missing", function() {
            var req = {
                body: undefined
            };

            auth.validateUserAuthInput(logSpy, req, undefined, nextSpy);

            expect(nextSpy).toHaveBeenCalled();
            expect(nextSpy.calls.length).toEqual(1);
            expect(nextSpy.calls[0].args.length).toEqual(1);
            expect(nextSpy.calls[0].args[0].statusCode).toEqual(400);
        });

        it("should return an error if the body is empty", function() {
            var req = {
                body: {}
            };

            auth.validateUserAuthInput(logSpy, req, undefined, nextSpy);

            expect(nextSpy).toHaveBeenCalled();
            expect(nextSpy.calls.length).toEqual(1);
            expect(nextSpy.calls[0].args.length).toEqual(1);
            expect(nextSpy.calls[0].args[0].statusCode).toEqual(400);
        });

        it("should return an error if the body is missing username", function(done) {
            var req = {
                body: {
                    username: null,
                    password: "password"
                }
            };

            var next = function() {
                expect(arguments.length).toEqual(1);
                expect(arguments[0].statusCode).toEqual(400);
                done();
            };

            auth.validateUserAuthInput(logSpy, req, undefined, next);
        });

        it("should call next with no parameters when body is valid", function(done) {
            var req = {
                body: {
                    username: "user@jetway.io",
                    password: "password"
                }
            };

            var next = function() {
                expect(arguments.length).toEqual(0);
                expect(req.local.credentials).toBeDefined();
                expect(req.local.credentials).toEqual({
                    username: "user@jetway.io",
                    password: "password"
                });
                done();
            };

            auth.validateUserAuthInput(logSpy, req, undefined, next);
        });
    }); // end of validateUserAuthInput function


    describe("checkLoginRecord function", function() {
    }); // end of checkLoginRecord function


    describe("validatePassword function", function() {
    }); // end of validatePassword function


    describe("generateJWT function", function() {
    }); // end of generateJWT function


    describe("returnJWT function", function() {
        it("should throw an exception if jwt is not in req.local", function() {
            var req = {
                local: {
                    // missing jwt
                }
            };

            expect(function() { auth.returnJWT(req, undefined, undefined); }).toThrow();
        });

        it("should return jwt token when present", function() {
            var req = {
                local: {
                    jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJlNjRhYmZhMi05N2E5LTRkYTEtYTU5Yy0yZjdhMmYxN2U0MGMiLCJpYXQiOjE0MTE1OTU0NjcsImV4cCI6MTQxMTQ5OTA2NywiaXNzIjoidXJuOmpldHdheSJ9.3np44RMLchYmo_VaDrpYFjhypyDyiFVe39dEDIiCzpkYt3ffLDndXb-rTSSNhtBLDtQtiWyaBaL0RqFg5olksA"
                }
            },
            resSpy = jasmine.createSpyObj("Response", ["json"]);
            auth.returnJWT(req, resSpy, undefined);
            expect(resSpy.json).toHaveBeenCalledWith({
                jwt: req.local.jwt
            });
        });
    }); // end of returnJWT function

});
