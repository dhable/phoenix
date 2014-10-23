/**
 * Represents a single line item in a Consumer's Cart.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("CartItem", {
        storeId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        itemId: {
            type: DataTypes.STRING(48),
            primaryKey: true,
            allowNull: false
        },
        consumerId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        rawScan:      DataTypes.STRING(48),
        display:      DataTypes.STRING(60),
        qty:          DataTypes.INTEGER,
        price:        DataTypes.DECIMAL(8,2),
        subtotal:     DataTypes.DECIMAL(8,2),
        tax:          DataTypes.DECIMAL(8,2)
   });
};
