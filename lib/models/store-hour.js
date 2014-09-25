/**
 * The StoreHour entity represents a day of the week opening and closing
 * time for a Store.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("StoreHour", {
      dayOfWeek:     DataTypes.INTEGER,
      localOpenHr:   DataTypes.INTEGER,
      localOpenMin:  DataTypes.INTEGER,
      localCloseHr:  DataTypes.INTEGER,
      localCloseMin: DataTypes.INTEGER
   });
};
