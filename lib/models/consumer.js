/**
 * The Consumer entity represents an identity of mobile application user that
 * shops and checks out at a retail location.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("Consumer", {
      id:               DataTypes.UUID,
      devicePrint:      DataTypes.STRING,
      email:            DataTypes.STRING(80),
      msisdn:           DataTypes.STRING(40),
      parentConsumer:   DataTypes.UUID
   });
};
