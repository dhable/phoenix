/*
 * phoenix: From the ashes the mobile POS will rise.
 *
 * Copyright (c) 2014, jetway.io. All rights reserved.
 */
var conf = require("./lib/conf"),
    log = require("./lib/logger")("boot"),
    pkgMetadata = {version: "0.1.0"};


log.info("Bootstrapping jetway.io Phoenix, version %s", pkgMetadata.version);
log.info("current working directory = %s", process.cwd());


// TODO: This line is temporary. Currently using to execrise sequelize
require("./lib/models");
require("./migrations").syncDb();
return;

var services = [
   require("./lib/api")
];


services.forEach(function(service) {
   var start = Date.now();

   try {
      log.info("attempting start of %s", service.name);
      service.start(conf);
   }
   catch(err) {
      log.error("failed to start %s [message = %s]", service.name, err.message);
      // TODO: Emit alarm that service failed to start
   }

   log.debug("service start execution for %s took %s ms", service.name, Date.now() - start);
});


process.once("SIGINT", function() {
   services.forEach(function(service) {
      try {
         service.stop();
      }
      catch(ex) {
         log.warn("failed to shutdown service %s: %s", service.name, ex);
      }
   });
});
