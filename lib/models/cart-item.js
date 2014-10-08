/**
 * Represents a single line item in a Consumer's Cart.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("CartItem", {
      storeId:      DataTypes.UUID,
      itemId:       DataTypes.STRING(48),
      rawScan:      DataTypes.STRING(48),
      display:      DataTypes.STRING(60),
      qty:          DataTypes.INTEGER,
      price:        DataTypes.DECIMAL(8,2),
      subtotal:     DataTypes.DECIMAL(8,2),
      tax:          DataTypes.DECIMAL(8,2),
      lastRefresh:  DataTypes.INTEGER
   });
};
