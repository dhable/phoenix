/**
 * This module contains all of the functionality that resides underneath the /authenticate
 * ReST endpoint. 
 *
 * @module api.auth
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    Checkit = require("checkit"),
    models = require("../models");


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
    if(req.body && !_.isEmpty(req.body)) {
        userCredentialRule
            .run(req.body)
            .then(function(validatedFields) {
                req.local = req.local || {};
                req.local.credentials = validatedFields;
                next();
            })
            .catch(Checkit.Error, function(err) {
                log.debug("validation of user auth input failed - %j", err);
                next(new restify.BadRequestError(err.message));
            });
    }
    else {
        next(new restify.BadRequestError("Missing body content."));
    }
};


/**
 * Restify request handling function that fetches a Login record from the DB using
 * the models. If there is no matching Login record, then we return the generic
 * Unauthorized error to obscure attacks on the server.
 *
 * @exported-for-testing
 * @private
 */
var checkLoginRecord = exports.checkLoginRecord = function(log, req, res, next) {
    var email = req.body.username;

    models.Login
        .find({where: {email: email}})
        .success(function(loginRec) {
            req.local.login = loginRec;
            next();
        })
        .failure(function(err) {
            log.debug("failed to retrieve login record for %s - %s", email, err);
            next(new restify.UnauthorizedError());
        });
};


/**
 * Restify request handling function that compares the supplied password against the
 * stored hashed password using bcrypt.
 *
 * @exported-for-testing
 * @private
 */
var validatePassword = exports.validatePassword = function(log, req, res, next) {
    var password = req.body.password,
        login = req.local.loginRec;

    bcrypt.compare(password, login.hashedPassword, function(err, result) {
        if(err) {
            log.debug("bcrypt failed to verify hashed password - %s", err);
            next(new restify.UnauthorizedError());
        }
        else if(result) {
            req.local.authUid = login.id;
            next();
        }
        else {
            log.debug("bcrypt said passwords don't match");
            next(new restify.UnauthorizedError());
        }
    });
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
         algorithm: conf.get("auth.jwt.algorithm"),
         expiresInMinutes: conf.get("auth.jwt.ttl"),
         issuer: conf.get("auth.jwt.issuer")
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
      _.partial(validateUserAuthInput, log), _.partial(checkLoginRecord, log), _.partial(validatePassword, log),
      _.partial(generateJWT, log, conf), returnJWT);

   server.get("/v1/authenticate/app", function(req, res, next) { res.send("ok"); });

   server.post("/v1/authenticate/app", function(req, res, next) { res.send("ok"); });

   log.debug("finished auth API bind");
};
