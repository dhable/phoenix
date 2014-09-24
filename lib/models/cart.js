/**
 *
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("Cart", {
      created: DataTypes.INTEGER,
      updated: DataTypes.INTEGER
   });
};
