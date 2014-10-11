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
    common = require("./common.js"),
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
 * Restify request handling function that will fetch all Store records that match the
 * given search criteria.
 *
 * @exported-for-testing
 * @private
 */
var findStoreRecords = 
exports.findStoreRecords = function(log, req, res, next) {
    models.Store
        .findAll()
        .success(function(stores) {
            req.local = req.local || {};
            req.local.stores = stores;
            next();
        });
};


/**
 * Restify request handling function that will attempt to retrieve a particular
 * Store record given an id value.
 *
 * @exported-for-testing
 * @private
 */
var loadStoreById = 
exports.loadStoreById = function(log, req, res, next) {
    if(req.context.storeId) {
        models.Store
            .find(req.context.storeId)
            .success(function(store) {
                req.local = req.local || {};
                req.local.store = store;
                next();
            });
    }
    else {
        next(new restofy.BadRequestError("storeId is a required request context parameter."));
    }
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
 * Picks the field for a single Store and returns the data elements that
 * aren't null.
 *
 * @exported-for-testing
 * @private
 */
var returnStore =
exports.returnStore = function(req, res, next) {
    var fieldNames = ["id", "name", "phone", "website", "lat", "lon", "addr1",
                      "addr2", "city", "state", "zipcode", "zipplus", "timezone"];

    var result = 
        _.pick(req.local.store.values, function(value, key) {
                return _.contains(fieldNames, key) && !_.isNull(value);
        });

    res.json(result);
    res.end();
};


/**
 * Picks the fields that we want to expose to the client and reformats the
 * data in the correct form.
 *
 * @exported-for-testing
 * @private
 */
var returnStores = 
exports.returnStores = function(req, res, next) {
    var results = 
        _(req.local.stores)
            .map(function(store) {
                var fieldNames = ["id", "name", "phone", "website", "lat", "lon", "addr1",
                                  "addr2", "city", "state", "zipcode", "zipplus", "timezone"];
                return _.pick(store.values, function(value, key) {
                    return _.contains(fieldNames, key) && !_.isNull(value);
                });
            })
            .valueOf();

    res.json(results);
    res.end();
};


/**
 * Grabs the revelent fields from the request body, builds a Store object
 * and then calls the ORM framework to create a new Store record in the
 * database.
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
 * Deletes a Store record from the database. This handler relies on the Sequelize
 * paranoid option on the model definition to ensure that the record isn't deleted
 * but instead flagged as deleted (logic our controller doesn't need to do).
 *
 * @exported-for-testing
 * @private
 */
var markStoreDeleted = 
exports.markStoreDeleted = function(log, req, res, next) {
    if(req.context.storeId) {
        models.Store
            .destroy({id: req.context.storeId})
            .success(function() {
                next();
            });
    }
    else {
        next(new restofy.BadRequestError("storeId is a required request context parameter."));
    }
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

    // retrieve a list of all the store records and return them
    server.get("/v1/stores", traits.authenticateRequest, 
                             _.partial(findStoreRecords, log), 
                             returnStores);

    // create a new Store object record
    server.post("/v1/stores", traits.authenticateRequest, 
                              _.partial(validateStoreInput, log), 
                              _.partial(createStoreRecord, log));

    // retrieve a particular store based on the GUID value
    server.get("/v1/stores/:storeId", traits.authenticateRequest, 
                                      _.partial(loadStoreById, log), 
                                      returnStore);

    // update a single store record
    /* TODO: Add method */
    
    // delete a store record
    server.del("/v1/stores/:storeId", traits.authenticateRequest,
                                      _.partial(markStoreDeleted, log),
                                      common.emptyOKChainHandler);

    log.debug("finished store API bind");
};
