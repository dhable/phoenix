var moneyUtils = require("../lib/money-utils.js");


describe("The moneyUtils module", function() {

    describe("round() function", function() {
        it("should return undefined if the amount is undefined", function() {
            var actualValue = moneyUtils.round(undefined);
            expect(actualValue).toBe(undefined);
        });

        it("should return null if the amount is null", function() {
            var actualValue = moneyUtils.round(null);
            expect(actualValue).toBe(null);
        });

        it("should raise an exception if a non-numeric amount is used", function() {
            expect(function() { moneyUtils.round("4"); }).toThrow("Type Not Number");
            expect(function() { moneyUtils.round({}); }).toThrow("Type Not Number");
            expect(function() { moneyUtils.round(true); }).toThrow("Type Not Number");
        });

        it("should return 2 decimals if passed a whole number", function() {
            var actualValue = moneyUtils.round(4);
            expect(actualValue).toBe(4.00);
        });

        it("should round down if last decimal is < 5", function() {
            var actualValue = moneyUtils.round(4.454);
            expect(actualValue).toBe(4.45);
        });

        it("should round up if the last decimal is >= 5", function() {
            var actualValue = moneyUtils.round(4.455);
            expect(actualValue).toBe(4.46);
        });

        it("should return the same value if it's two decimal places", function() {
            var actualValue = moneyUtils.round(4.46);
            expect(actualValue).toBe(4.46);
        });
    });

});
