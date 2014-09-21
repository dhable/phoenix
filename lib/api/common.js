/**
 * Module with various common functions for working with Restify or
 * building up Restify chain handling functions.
 */
var _ = require("lodash"),
    restify = require("restify"),
    opmon = require("../opmon"),
    log = require("../logger")("api"); 


var oldBrowserRedirectTmpl = _.template(
   "<html>" +
   "<head><title>Page Moved</title></head>" +
   "<body>" +
   "<h1>This page has moved</h1>" +
   "<p>This page has moved to <a href='${newLocation}'>${newLocation}</a>.</p>" +
   "</body></html>");


/**
 * A Restify chain handler that simply generates a HTTP/200 response with
 * no body content.
 */
exports.emptyOKChainHandler = function(req, res, next) {
   res.send(200);
   next(false);
};


/**
 * Issues a HTTP redirect to a new URL. Also sends back a HTML page to handle
 * older browsers or browsers that fail to follow the redirect header.
 * 
 * @param redirectTo A fully qualified URL (e.g. http://domain.com) on where to redirect to.
 * @return Restify chain function that will handle the rediret.
 */
exports.redirect = function(redirectTo, req, res, next) {
   var htmlPayload = oldBrowserRedirectTmpl({newLocation: redirectTo});

   res.writeHead(301, {
      "Content-Type": "text/html",
      "Content-Length": htmlPayload.length,
      "Location": redirectTo
   });

   res.write(htmlPayload);
   res.end();
   next(false);
};


/**
 * Restify middleware handler that sets the req.local startTime variable. This is designed to be
 * used with the emitOpStats function to time how long APIs are taking to execute.
 *
 * @param req The HTTP request object.
 * @param res The HTTP response object.
 * @param next The restify continuation callback.
 */
exports.setStartTime = function(req, res, next) {
   if(_.has(req, "local")) {
      req.local.startTime = Date.now();
   }
   else {
      log.warn("local storage not initalized, skipping setting start time - check order of use() calls");
   }

   next();
};


/**
 * Restify event handler designed to run after every API route has executed and emit some
 * operational metrics to opmon. The timing data depends on the setStarTime restify middleware
 * executing prior to the route being started.
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 * @param route The restify Route object
 * @param error Any route error that might exist, otherwise null.
 */
exports.emitOpStats = function(req, res, route, error) {
   try {
      var endTime = Date.now(),
          startTime = req.local.startTime || endTime + 1, // this way execution time is negative as a signal
          totalTime = endTime - startTime;

      opmon.recordApiProcessed(route.name, res.statusCode, totalTime);
               
      if(error) {
         log.error("route = %s, req.local = %j, error = %s", route.name, req.local, error);
      }
   }
   catch(ex) {
      log.error("how embarassing! problem logging operation stats after the route executed: %s", ex);
   }
};
 
        
/**
 * Restify event handler designed to log out any uncaught exceptions to the application logs
 * and replace the HTTP response with a generic error message. This is to ensure that the logs
 * contain any exception messages plus hide any implementation bug details from the user.
 *
 * @param req The HTTP request object
 * @param res The HTTP response object
 * @param route The restify Route object
 * @param error The uncaught exception
 */
exports.trapUncaughtException = function(req, res, route, error) {
   try {
      log.error("route = %s, req.local = %j, error = %s", route.name, req.local, error);

      res.json({
         error: "An internal error has occured. We dropped the ball on this an we're sorry."
      });
   }
   catch(ex) {
      log.error("how embarassing! another exception while handling an unhandled exception: %s", ex);
   }
};
