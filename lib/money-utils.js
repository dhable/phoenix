/**
 * money-utils is a colleciton of functions designed to manipulate
 * floating point numbers in a known way if those numbers should happen
 * to handle currency values.
 */
var _ = require("lodash");


exports.round = function(amt) {
    if(_.isUndefined(amt) || _.isNull(amt)) {
        return amt;
    }

    if(!_.isNumber(amt)) {
        throw new Error("Type Not Number");
    }

    var basisAmt = amt * 100,
        roundedBasisAmt = Math.round(basisAmt);
    return roundedBasisAmt / 100;
};
