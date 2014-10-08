/**
 * The TransactionItem entity is a child entity of Transaction and represents
 * a single line item that was purchased. A Transaction can have multiple 
 * TransactionItems but needs at least one TransactionItem to be meaningful.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("TransactionItem", {
      transactionId:    DataTypes.UUID,
      itemId:           DataTypes.STRING(48),
      rawScan:          DataTypes.STRING(48),
      description:      DataTypes.VARACHAR(60),
      qty:              DataTypes.INTEGER,
      price:            DataTypes.DECIMAL(8,2),
      subtotal:         DataTypes.DECIMAL(8,2),
      tax:              DataTypes.DECIMAL(8,2)
   });
};
