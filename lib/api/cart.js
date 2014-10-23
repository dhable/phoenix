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
    moneyUtils = require("../money-utils.js"),
    models = require("../models"),
    common = require("./common.js"),
    traits = require("./traits.js");

/**
 * @exported-for-testing
 * @private
 */
var fetchShoppingCartItems = 
exports.fetchShoppingCartItems = function(req, res, next) {
    var storeId = req.context.storeId,
        consumerId = req.context.consumerId;

    models.CartItem
        .findAll({
            where: {
                consumer: req.context.consumerId,
                storeId: req.context.storeId
            }
        })
        .success(function(items) {
            req.local = req.local || {};
            req.local.cartItems = items;
            next();
        });
};


/**
 * @exported-for-testing
 * @private
 */
var returnShoppingCartItems =
exportes.returnShoppingCartItems = function(req, res, next) {
    var items = req.local.cartItems || [];

    res.json(
        _(items)
            .map(function(cartItem) {
                return {
                    item: cartItem.values.itemId,
                    rawScan: cartItem.values.rawScan,
                    qty: cartItem.values.qty,
                    display: cartItem.values.display,
                    price: moneyUtils.round(cartItem.values.price),
                    subtotal: moneyUtils.round(cartItem.values.subtotal),
                    tax: moneyUtils.round(cartItem.values.tax)
                };
            })
            .value());
};


var cartItemRule = new Checkit({
    item: [
        {rule: "required", message: "Item ID (UPC) is a required field."},
        {rule: "minLength:3", message: "Item ID needs to be at least 3 digits."},
        {rule: "maxLength:48", message: "Item ID cannot be longer than 48 digits."},
        {rule: "numeric", message: "Item ID is only allowed to contain a numeric digits."}
    ],
    qty: [
        {rule: "required", message: "Item quantity is a required field."},
        {rule: "number", message: "Item quantity needs to be a valid JSON number."},
        {rule: "min:0", message: "Item quantity minimum value is 0."}
    ]
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
                                     traits.validateConsumerId,
                                     fetchShoppingCartItems,
                                     returnShoppingCartItems);

    server.put("/v1/carts/:storeId", traits.authenticateRequest,
                                     traits.validateConsumerId,
                                     fetchShoppingCartItems,
                                     // TODO: merge input changes and save cart items
                                     returnShoppingCartItems);

    // Need to flush out the details on this request before we can implement
    server.post("/v1/carts/:storeId", traits.authenticateRequest,
                                      traits.validateConsumerId,
                                      common.emptyOKChainHandler);

    log.debug("finished cart API bind");
};
