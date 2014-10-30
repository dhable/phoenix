var jwt = require("jsonwebtoken"),
    traits = require("../../../lib/api/traits.js");


describe("The traits module", function() {

   describe("authenticateRequest function", function() {
      var nextSpy, mockRequest;

      beforeEach(function() {
         nextSpy = jasmine.createSpy("next");
         mockRequest = {params: {}};
      });

      function genJWT(issuer, secret, uid) {
         return jwt.sign({uid: uid}, secret, {
            algorithm: "HS512",
            expiresInMinutes: 60,
            issuer: issuer
         });
      }

      function assertUnauthorized(nextSpy) {
         expect(nextSpy).toHaveBeenCalled();
         expect(nextSpy.calls.length).toEqual(1);
         expect(nextSpy.calls[0].args.length).toEqual(1);
         expect(nextSpy.calls[0].args[0].statusCode).toEqual(401);
      }

      it("should call next with UnauthorizedError if auth param is missing", function() {
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         assertUnauthorized(nextSpy);
      });

      it("should call next with UnauthorizedError if auth isn't a JWT token", function() {
         mockRequest.params.auth = "Not a JWT";
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         assertUnauthorized(nextSpy);
      });

      it("should call next with UnauthorizedError if auth JWT token signature is invalid", function() {
         mockRequest.params.auth = genJWT("urn:jetway", "randomSecret", "e64abfa2-97a9-4da1-a59c-2f7a2f17e40c");
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         assertUnauthorized(nextSpy);
      });

      it("should call next with UnauthorizedError if auth JWT token issuer doesn't match", function() {
         mockRequest.params.auth = genJWT("qthru.com", "secret", "e64abfa2-97a9-4da1-a59c-2f7a2f17e40c");
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         assertUnauthorized(nextSpy);
      });

      it("should call next with UnauthorizedError if auth JWT token has expired", function() {
         mockRequest.params.auth = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJlNjRhYmZhMi05N2E5LTRkYTEtYTU5Yy0yZjdhMmYxN2U0MGMiLCJpYXQiOjE0MTE1OTU0NjcsImV4cCI6MTQxMTQ5OTA2NywiaXNzIjoidXJuOmpldHdheSJ9.3np44RMLchYmo_VaDrpYFjhypyDyiFVe39dEDIiCzpkYt3ffLDndXb-rTSSNhtBLDtQtiWyaBaL0RqFg5olksA";
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         assertUnauthorized(nextSpy); 
      });

      it("should call next with no params if auth JWT token is valid and issued by Jetway", function() {
         mockRequest.params.auth = genJWT("urn:jetway", "secret", "e64abfa2-97a9-4da1-a59c-2f7a2f17e40c");
         traits.authenticateRequest(mockRequest, undefined, nextSpy);
         expect(nextSpy).toHaveBeenCalled();
         expect(nextSpy.calls.length).toEqual(1);
         expect(nextSpy.calls[0].args.length).toEqual(0);
         expect(mockRequest.local.authUser).toEqual("e64abfa2-97a9-4da1-a59c-2f7a2f17e40c");
      });
   });

});
