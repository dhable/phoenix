/**
 * Loads the application configuration from a number of possible
 * configuration sources and then validates against the known
 * schema.
 *
 * @module conf
 */
var path = require("path"),
    convict = require("convict");


var schema = {
   auth: {
      jwt: {
         algorithm: {
            doc: "The JWT HMAC algorithm to use when signing the generated token",
            default: "HS512"
         },
         ttl: {
            doc: "The number of minutes that the JWT is valid for (token expiration).",
            default: 60
         },
         issuer: {
            doc: "The value to use as the issuer of the JWT token",
            default: "urn:jetway"
         },
         secret: {
            doc: "The secret salt data to use as entropy in the signing of the JWT token",
            default: "secret"
         }
      }
   },
   port: {
      doc: "Port to bind the ReST API to.",
      format: "port",
      default: 3000,
      env: "PORT",
      arg: "port"
   },
   db: {
   },
   statsd: {
      host: {
         doc: "Host name of the statsd server",
         default: "localhost"
      },
      port: {
         doc: "Port of the statsd server.",
         default: 8125
      },
      namespace: {
         doc: "Common stat name namespace for phoenix",
         default: "phoenix"
      },
      disable: {
         doc: "Determine if the stats emitting functionality is active",
         default: false
      }
   }
};

global.phoenix = global.phoenix || {};
global.phoenix.conf = convict(schema);

global.phoenix.conf.validate();


/**
 * Returns the currently loaded configuration. This method can load the
 * configuration if one previously hasn't been loaded.
 */
module.exports = global.phoenix.conf;
