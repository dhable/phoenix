/**
 * Represents a single line item in a Consumer's Cart.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("CartItem", {
      item:       DataTypes.STRING,
      rawScan:    DataTypes.STRING,
      display:    DataTypes.STRING,
      qty:        DataTypes.INTEGER,
      price:      DataTypes.DECIMAL(10,2),
      subtotal:   DataTypes.DECIMAL(10,2),
      tax:        DataTypes.DECIMAL(10,2),
      updated:    DataTypes.INTEGER
   });
};
