/**
 * Represents a key/value configuration item that we'll need to keep track
 * of (e.g. which subscription plan, etc.).
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("StoreConfig", {
      storeId:      DataTypes.UUID,
      key:          DataTypes.STRING(160),
      value:        DataTypes.STRING(160)
   });
};
