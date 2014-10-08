/**
 * The Login is a record that represents the credentials, permissions set and 
 * other attributes associated with users that come in through the portal to
 * maintain the POS checkout setup.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Login", {
        email:          DataTypes.STRING(80),
        hashedPasswd:   DataTypes.STRING(512),
        created:        DataTypes.INTEGER,
        updated:        DataTypes.INTEGER,
        deleted:        DataTypes.INTEGER
    });
};
