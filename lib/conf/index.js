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
   port: { /* can this be moved or eliminated? */
      doc: "Port to bind the ReST API to.",
      format: "port",
      default: 3000,
      env: "PORT",
      arg: "port"
   },
   postgres: {
      host: {
         doc: "The hostname running the PostgreSQL server.",
         env: "PSQL_HOST",
         default: "localhost"
      },
      port: {
         doc: "The port the PostgreSQL server is bound to.",
         format: "port",
         env: "PSQL_PORT",
         default: 5432
      },
      username: {
         doc: "The user to use when logging into the PostgreSQL database.",
         env: "PSQL_USER",
         default: "jetway"
      },
      password: {
         doc: "The password associated with the username.",
         env: "PSQL_PASS",
         default: "password"
      },
      database: {
         doc: "The database name.",
         env: "PSQL_DB",
         default: "jetway_pos"
      }
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
