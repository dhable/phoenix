/**
 * The TransactionItem entity is a child entity of Transaction and represents
 * a single line item that was purchased. A Transaction can have multiple 
 * TransactionItems but needs at least one TransactionItem to be meaningful.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("TransactionItem", {
      qty:        DataTypes.INTEGER,
      display:    DataTypes.STRING(120),
      price:      DataTypes.DECIMAL(10,2),
      subtotal:   DataTypes.DECIMAL(10,2),
      tax:        DataTypes.DECIMAL(10,2)
   });
};
