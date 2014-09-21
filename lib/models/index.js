/**
 * Top level entry point into the DB model objects and an abstraction
 * on top of how the data is being stored.
 */

var jugglingdb = require("jugglingdb");

    
var Schema = jugglingdb.Schema,
    pgSchema = new Schema("pg", {}); // won't work as written


exports.Cart = require("./cart.js")(pgSchema);
exports.Consumer = require("./consumer.js")(pgSchema);
exports.Store = require("./store.js")(pgSchema);
exports.Transaction = require("./transaction.js")(pgSchema);
exports.TransactionItem = require("./transaction-item.js")(pgSchema);

