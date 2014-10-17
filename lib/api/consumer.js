/**
 * This module contains all the functionality that resides underneath the /consumers
 * ReST endpiint.
 *
 * @module api.consumer
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    Checkit = require("checkit"),
    models = require("../models"),
    traits = require("./traits.js");


var consumerInputRule = new Checkit({
    platform: {rule: "required", message: "Mobile platform name is required."},
    version: {rule: "required", message: "Mobile platform version is required."},
    id: {rule: "required", message: "Platform defined uuid is required."}
});


/**
 * Checks the inbound request body to ensure that it has all the necessary
 * fields that we'd expect.
 *
 * @exported-for-testing
 * @private
 */
var validateConsumerInput = 
exports.validateConsumerInput = function(log, req, res, next) {
    if(req.body && !_.isEmpty(req.body)) {
        consumerInputRule
            .run(req.body)
            .then(function(validatedFields) {
                next();
            })
            .catch(Checkit.Error, function(err) {
                log.debug("validation of consumer input failed: %j", err);
                next(new restify.BadRequestError(err.message));
            });
    }
    else {
        next(new restify.BadRequestError("Missing body content."));
    }
};


/**
 * Looks in the DB for a consumer record that would match the input
 * criteria. If one can't be found quickly, create a new record and then
 * return the new UUID. We'll join records later on in an offline
 * job based on more criteria (probably Hadoop).
 *
 * @exported-for-testing
 * @private
 */
var createOrFetchConsumerId =
exports.createOrFetchConsumerId = function(log, req, res, next) {
    var devicePrintStr = "platform=" + req.body.platform + "," +
                         "version=" + req.body.version + "," +
                         "id=" + req.body.id;

    models.Consumer
        .findOrCreate({
            where: {devicePrint: devicePrintStr}
        })
        .success(function(consumer) {
            req.local = req.local || {};
            req.local.consumer = consumer;
            next();
        });
};


/**
 * Returns a list of all the purchases associated with the consumer profile.
 *
 * @exported-for-testing
 * @private
 */
var fetchConsumerActivity =
exports.fetchConsumerActivity = function(log, req, res, next) {
    models.Transaction
        .findAll({
            where: {consumer: req.context.consumerId}
        })
        .success(function(transactions) {
            req.local = req.local || {};
            req.local.transactions = transactions;
            next();
        });
};


/**
 * Returns the consumer GUID that should be included on requests that deal with
 * the shopping cart.
 *
 * @exported-for-testing
 * @private
 */
var returnConsumerId = 
exports.returnConsumerId = function(req, res, next) {
    var uuidField = _.pick(req.local.consumer.values, "id");
    res.json(uuidField);
    res.end();
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
    log.debug("binding consumer API endpoints to restify server");

    server.post("/v1/consumers", traits.authenticateRequst,
                                 _.partial(createOrFetchConsumerId, log),
                                 returnConsumerId);

    server.get("/v1/consumers/:consumerId", traits.authenticateRequest,
                                            _.partial(fetchConsumerActivity, log)); 

    log.debug("finished consumer API bind");
};

