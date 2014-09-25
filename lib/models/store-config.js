/**
 * Represents a key/value configuration item that we'll need to keep track
 * of (e.g. which subscription plan, etc.).
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("StoreConfig", {
      key:        DataTypes.STRING,
      value:      DataTypes.STRING,
      updated:    DataTypes.INTEGER,
      updatedBy:  DataTypes.STRING
   });
};
