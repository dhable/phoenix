/*
 * phoenix: From the ashes the mobile POS will rise.
 * Copyright (C) 2014 Dan Hable & Mark Franklin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var path = require("path"),
    _ = require("lodash"),
    Sequelize = require("sequelize"),
    conf = require("./lib/conf"),
    log = require("./lib/logger")("boot"),
    pkgMetadata = {version: "0.1.0"};


log.info("phoenix, version %s Copyright (C) 2014 Dan Hable & Mark Franklin\n", pkgMetadata.version);
log.info("This program comes with ABSOLUTELY NO WARRANTY; This is free");
log.info("software, and you are welcome to redistribute it under certain ");
log.info("conditions.\n\n");
log.info("current working directory = %s", process.cwd());


/**
 * Helper function that will apply the Sequelize migrations to a new database
 * connection. This ensures that
 *   1) the database configuration is correct because we just connected to it,
 *   2) the database is in a known up-to-date state.
 *
 * @exported-for-testing
 * @private
 */
var initDatabase =
exports.initDatabase = function(conf, done) {
    log.info("setting up Sequelize database engine pointing to PostgreSQL");

    var dbase = conf.get("postgres.database"),
        uname = conf.get("postgres.username"),
        pword = conf.get("postgres.password"),
        host = conf.get("postgres.host"),
        port = conf.get("postgres.port"),
        sqlEngine;

    global.dbEngine = new Sequelize(dbase, uname, pword, {
        dialect: "postgres",
        host: host,
        port: port
    });

    log.info("checking migrations on the database");

    dbEngine
        .getMigrator({path: path.join(__dirname, "migrations")})
        .migrate({method: "up"})
        .success(done)
        .failure(done);
};


/**
 * This event handler is designed to trap the SIGINT signal from the operating system.
 * This is sent when hitting Ctrl-C or using the 'kill' command. It's designed to shut
 * down the server in an orderly fashion.
 *
 * @exported-for-testing
 * @private
 */
var interruptSignalHandler = 
exports.interruptSignalHandler = function(services) {
    services.forEach(function(module) {
        try {
            // TODO: Clean up the database?
            module.stop();
        }
        catch(err) {
            log.warn("failed to shutdown service %s: %s", module.name, err);
        }
    });
};


/**
 * Takes a list of modules that conform to the service interface and loops through
 * all of them attempting to start them.
 *
 * @exported-for-testing
 * @private
 */
var bootServices =
exports.bootServices = function(conf, services) {
    services.forEach(function(service) {
        var startTime = Date.now();
        try {
            log.info("starting service %s", service.name);
            service.start(conf);
        }
        catch(err) {
            log.error("FAILED TO START SERVICE %s. Err: %s", service.name, err);
            return process.exit(1);
        }

        // TODO: Do we need to wait for the service to indicate done? Probably.
        log.debug("boot time for service %s took %s ms", service.name, Date.now() - startTime);
    });
};


////////////////////////////////////////////////////////////////////////////////
// The main method content
////////////////////////////////////////////////////////////////////////////////
initDatabase(conf, function(err) {
    if(err) {
        log.error("DATABASE MIGRATION FAILED! Manual intervention required with service. Err: %s", err);
        return process.exit(1);
    }

    var services = [
        require("./lib/api")
    ];

    bootServices(conf, services);
    process.once("SIGINT", _.partial(interruptSignalHandler, services));
});
