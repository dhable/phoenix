/**
 * The Transaction entity is a container object that captures a completed
 * purchase record. In combination with TransactionItem, the entire history
 * of the purchase can be reconstructed.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("Transaction", {
      sessionStart:        DataTypes.INTEGER,
      sessionEnd:          DataTypes.INTEGER,
      payType:             DataTypes.STRING(12),
      payConfirmation:     DataTypes.STRING,
      deviceFingerprint:   DataTypes.STRING
   });
};
