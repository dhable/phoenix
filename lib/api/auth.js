/**
 * This module contains all of the functionality that resides underneath the /authenticate
 * ReST endpoint. 
 *
 * @module api.auth
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    jwt = require("jsonwebtoken"),
    Checkit = require("checkit");


/**
 * Input schema validation rule for the POST /authenticate/user ReST endpoint.
 * @private
 */
var userCredentialRule = new Checkit({
    username: {rule: "required", message: "Username is a required parameter."},
    password: {rule: "required", message: "Password is a required parameter."}
});


/**
 * Restify request handling function that checks in the body input data format to
 * make sure it contains all that parts and is valid.
 *
 * @exported-for-testing
 * @private
 */
var validateUserAuthInput = exports.validateUserAuthInput = function(log, req, res, next) {
    if(req.body) {
        userCredentialRule
            .run(req.body)
            .then(function(validatedFields) {
                req.local.credentials = _.pick(req.body, validatedFields);
                next();
            })
            .catch(Checkit.Error, function(err) {
                log.debug("validation of user auth input failed - %j", err);
                next(new restify.BadRequestError(err.message));
            });
    }
    else {
        next(new restify.BadRequestError());
    }
};


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


/**
 * Exported method that will bind all of the auth functionality to a running server
 * environment.
 *
 * @param server The restify server instance.
 * @param log The logger instance.
 * @param conf The configuration instance.
 */
exports.bind = function(server, log, conf) {
   log.debug("binding auth API endpoints to restify server");

   server.post("/v1/authenticate/user", 
      _.partial(validateUserAuthInput, log),
      // 2. look for matching user in DB
      // 3. verify password matches stored hash
      _.partial(generateJWT, log, conf),
      returnJWT
   );

   log.debug("finished auth API bind");
};
