/**
 *
 * @module api.auth
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    jwt = require("jsonwebtoken");


/**
 * Restify request handlng function that generates a JWT token given that a previous
 * request handling function has placed a valid UID token in the req.local hash. This
 * uid is needed since it will be included in the body of the JWT token.
 * 
 * @exported-for-testing
 * @private
 */
var generateJWT = exports.generateJWT = function(log, conf, req, res, next) {
   try {
      var options = {
         algorithm: conf.get("auth..jwt.algorithm"),
         expiresInMinutes: conf.get("auth.jwt.ttl"),
         issuer: conf.get("auth..jwt.issuer")
      };

      req.local.jwt = jwt.sign({uid: req.local.authUid},
                               conf.get("auth.jwt.secret"), 
                               options);

      return next();
   }
   catch(err) {
      log.error("api.auth.generateJWT() call failed - %s", err);
      throw err;
   }
};


/**
 * Restify request hanlding function that generates a ReST response for returning the JWT 
 * token from an auth request. This function assumes that a JWT token has already been placed
 * in the req.local hash.
 *
 * @exported-for-testing
 * private
 */
var returnJWT = exports.returnJWT = function(req, res, next) {
   if(!req.local.jwt) {
      throw new Error("returnJWT() could not find token in req.local.jwt");
   }

   res.json({
      jwt: req.local.jwt
   });
};




exports.bind= function(server, log, conf) {
   log.debug("Binding auth API endpoints to restify server");

   server.post("/v1/authenticate/user", function(req, res, next) { res.send("ok"); }
      // 1. validate JSON body content
      // 2. look for matching user in DB
      // 3. verify password matches stored hash
      // _.partial(log, conf, generateJWT),
      // returnJWT
   );
   


   log.debug("Finished auth API bind");
};
