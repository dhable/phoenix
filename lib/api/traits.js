/**
 * @module api.traits
 * @private
 */
var jwt = require("jsonwebtoken"),
    restify = require("restify"),
    models = require("../models");


/**
 * Implements the contextual trait that scans for a valid consumer
 * ID being passed in on the request.
 */
exports.validateConsumerId = function(req, res, next) {
    if(!req.params.consumer) {
        return next(new restify.BadRequestError("Missing consumer parameter"));
    }

    models.Consumer
        .find(req.params.consumer)
        .success(function(consumerObj) {
            req.local = req.local || {};
            req.local.consumer = consumerObj;
            return next();
        });
};


/**
 * ReST API trait (aka middleware function) that will check a JWT token to ensure
 * that it is valid and that the API is allowed to be made. Since this function is
 * likely to be called quite a bit, it should not depend on any sort of DB call.
 */
exports.authenticateRequest = function(req, res, next) {
   if(!req.params.auth) {
      //log.debug("API call is secure but missing auth parameter");
      return next(new restify.UnauthorizedError());
   }

   jwt.verify(req.params.auth, "secret", {issuer: "urn:jetway"}, function(err, decoded) {
      if(err) {
         //log.debug("JWT token verification failed - %s", err);
         return next(new restify.UnauthorizedError());
      }

      req.local = req.local || {};
      req.local.authUser = decoded.uid;
      return next();
   });
};
