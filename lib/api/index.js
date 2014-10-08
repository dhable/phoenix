var _ = require("lodash"),
    restify = require("restify"),
    common = require("./common.js"),
    log = require("../logger")("api");


var server;


exports.name = "API";


exports.start = function(conf) {
   var port = conf.get("port");

   server = restify.createServer({
      name: "phoenix", 
      version: "0.1.0"
   });

   log.debug("initializing restify middleware functions");
   server.use(restify.gzipResponse());
   server.use(restify.queryParser());
   server.use(restify.bodyParser());
   server.use(common.setStartTime);

   // Setup some custom hooks on various restify actions. These are used
   // for monitoring, redirecting and provide better error responses
   // so it doesn't look so much like restify.
   log.debug("setting up restify event handlers");
   server.on("NotFound", _.partial(common.redirect, "http://dev.jetway.io"));
   server.on("after", common.emitOpStats);
   server.on("uncaughtException", common.trapUncaughtException);


   // Load each of the API modules into the server.
   log.debug("bindig application routes to restify server");
   require("./auth.js").bind(server, log, conf);
   //require("./profile.js").init(server, log, conf);
   //require("./notification.js").init(server, log, conf);
   
   log.debug("attempting to listen on port %s", port);                      
   server.listen(port, function() {
      log.debug("listening on port %s successful", port);
   });
};


exports.stop = function() {
   if(server) {
      server.close();
   }
};
