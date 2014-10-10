/**
 * This module contains all of the functionality that resides underneath the /stores
 * ReST endpoint.
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
 * Input schema validation rule for Store data being accepted via the
 * POST /stores endpoint.
 *
 * @private
 */
var storeRule = new Checkit({
    name: {rule: "required", message: "Store name is a required parameter."},
    phone: {rule: "required", message: "Store phone number is a required parameter."},
    lat: [
        {rule: "required", message: "Store lat (decimal latitude) is a required parameter."},
        {rule: "number", message: "Store lat (decimal latitude) must be a number."},
        {rule: "between:-90:90", message: "Store lat (decimal latitude) value is outside range."}
    ],
    lon: [
        {rule: "required", message: "Store lon (decimal longitude) is a required parameter."},
        {rule: "number", message: "Store lon (decimal longitude) must be a number."},
        {rule: "between:-180:180", message: "Store lon (decimal longitude) value is outside range."}
    ]
});


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
 * Restify request handling function that validates the Store input data to ensure that
 * it meets the specification.
 *
 * @exported-for-testing
 * @private
 */
var validateStoreInput = 
exports.validateStoreInput = function(log, req, res, next) {
    if(req.body && !_.isEmpty(req.body)) {
        storeRule
            .run(req.body)
            .then(function(validatedFields) {
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
 *
 * @exported-for-testing
 * @private
 */
var returnStores = exports.returnStores = function(req, res, next) {
};


/**
 *
 * @exported-for-testing
 * @private
 */
var createStoreRecord = 
exports.createStoreRecord = function(log, req, res, next) {
    models.Store
        .create(_.pick(req.body, "name", "phone", "website", "lat", "lon", "addr1", "addr2",
                                   "city", "state", "zipcode", "zipplus", "timezone"))
        .success(function(store) {
            res.json({guid: store.id});
            res.end();
            next();
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
    log.debug("binding store API endpoints to restify server");

    server.get("/v1/stores", 
        traits.authenticateRequest, _.partial(findStoreRecords, log), returnStores);

    server.post("/v1/stores", 
        traits.authenticateRequest, _.partial(validateStoreInput, log), 
        _.partial(createStoreRecord, log));

    server.get("/v1/stores/:storeId", 
        traits.authenticateRequest, loadStoreById, returnStores);

    log.debug("finished store API bind");
};
