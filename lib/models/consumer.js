/**
 * The Consumer entity represents an identity of mobile application user that
 * shops and checks out at a retail location.
 */
module.exports = function(sequelize, DataTypes) {
   return sequelize.define("Consumer", {
      deviceSignature:   DataTypes.STRING,
      msisdn:            DataTypes.STRING(40),
      email:             DataTypes.STRING(120)
   });
};
