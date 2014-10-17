/**
 * This module contains all the functionality that resides underneath the /carts
 * ReST endpoint.
 *
 * @module api.cart
 * @private
 */
var _ = require("lodash"),
    restify = require("restify"),
    Checkit = require("checkit"),
    models = require("../models"),
    common = require("./common.js"),
    traits = require("./traits.js");


var cartItemRule = new Checkit({
});

var cartCheckoutRule = new Checkit({
});


/**
 * Exported method that will bind all of the cart API functionality to a running server
 * environment.
 *
 * @param server The restify server instance.
 * @param log The logger instance.
 * @param conf The configuration instance.
 */
exports.bind = function(server, log, conf) {
    log.debug("binding cart API endpoints to restify server");

    server.get("/v1/carts/:storeId", traits.authenticateRequest,
                                     common.emptyOKChainHandler);

    server.put("/v1/carts/:storeId", traits.authenticateRequest,
                                     common.emptyOKChainHandler);

    server.post("/v1/carts/:storeId", traits.authenticateRequest,
                                      common.emptyOKChainHandler);

    log.debug("finished cart API bind");
};
