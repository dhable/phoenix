/**
 * The Store entity represents a location that products are sold. These are one
 * of the key entities in the system that form the foundation of the Jetway
 * POS system.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("Store", {
      name:     DataTypes.STRING(80),
      phone:    DataTypes.STRING(12),
      lat:      DataTypes.DECIMAL(8,5),
      lon:      DataTypes.DECIMAL(8,5),
      addr1:    DataTypes.STRING(80),
      addr2:    DataTypes.STRING(80),
      city:     DataTypes.STRING(60),
      state:    DataTypes.STRING(2),
      zipcode:  DataTypes.STRING(5),
      zipplus:  DataTypes.STRING(4),
      created:  DataTypes.INTEGER,
      deleted:  DataTypes.INTEGER
   });
};

