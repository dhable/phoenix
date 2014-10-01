/**
 *
 * @module api.store
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    Checkit = require("checkit"),
    models = require("../models"),
    traits = require("./traits.js");


/**
 *
 * @exported-for-testing
 * @private
 */
var findStoreRecords = exports.findStoreRecords = function(log, req, res, next) {
};


/**
 *
 * @exported-for-testing
 * @private
 */
var loadStoreById = exports.loadStoreById = function(log, req, res, next) {
};


/**
 *
 * @exported-for-testing
 * @private
 */
var validateStoreInput = exports.validateStoreInput = function(log, req, res, next) {
};


/**
 *
 * @exported-for-testing
 * @private
 */
var returnStores = exports.returnStores = function(req, res, next) {
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
    log.debug("binding store API endpoints to restify server");

    server.get("/v1/stores", traits.authenticateRequest, _.partial(findStoreRecords, log), returnStores);

    server.post("/v1/stores", traits.authenticateRequest, _.partial(validateStoreInput, log)
        );

    server.get("/v1/stores/:storeId", traits.authenticateRequest, loadStoreById, returnStores);

    log.debug("finished store API bind");
};
