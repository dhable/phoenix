var Sequelize = require("sequelize");

/*
 * This is the initial database schema migration.
 */
module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable("Stores", {
            id:             { type: DataTypes.UUID, primaryKey: true },
            name:           { type: DataTypes.STRING(80), allowNull: false },
            phone:          { type: DataTypes.STRING(12) },
            website:        { type: DataTypes.STRING(255) },
            lat:            { type: DataTypes.DECIMAL(8,5) },
            lon:            { type: DataTypes.DECIMAL(8,5) },
            addr1:          { type: DataTypes.STRING(80) },
            addr2:          { type: DataTypes.STRING(80) },
            city:           { type: DataTypes.STRING(60) },
            state:          { type: DataTypes.STRING(2) },
            zipcode:        { type: DataTypes.STRING(5) },
            zipplus:        { type: DataTypes.STRING(4) },
            timezone:       { type: DataTypes.STRING(120) },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("StoreConfigs", {
            storeId:        { type: DataTypes.UUID, primaryKey: true },
            key:            { type: DataTypes.STRING(160), primaryKey: true },
            value:          { type: DataTypes.STRING(160) },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("StoreHours", {
            storeId:        { type: DataTypes.UUID, primaryKey: true },
            dayOfWeek:      { type: DataTypes.INTEGER, primaryKey: true },
            localOpenHr:    { type: DataTypes.INTEGER },
            localOpenMin:   { type: DataTypes.INTEGER },
            localCloseHr:   { type: DataTypes.INTEGER },
            localCloseMin:  { type: DataTypes.INTEGER },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("StoreItems", {
            storeId:        { type: DataTypes.UUID, primaryKey: true },
            itemId:         { type: DataTypes.STRING(48), primaryKey: true },
            description:    { type: DataTypes.STRING(60), allowNull: false  },
            qty:            { type: DataTypes.INTEGER, allowNull: false },
            amount:         { type: DataTypes.DECIMAL(8,2), allowNull: false },
            taxRate:        { type: DataTypes.DECIMAL(5,4), allowNull: false, default: 0.0 },
            linkedItem:     { type: DataTypes.STRING(48), allowNull: true },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("Consumers", {
            id:             { type: DataTypes.UUID, primaryKey: true },
            devicePrint:    { type: DataTypes.STRING, allowNull: false },
            parentConsumer: { type: DataTypes.UUID },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("Logins", {
            email:          { type: DataTypes.STRING(80), primaryKey: true },
            hashedPwd:      { type: DataTypes.STRING(512), allowNull: false },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("CartItems", {
            storeId:        { type: DataTypes.UUID, primaryKey: true },
            itemId:         { type: DataTypes.STRING(48), primaryKey: true },
            rawScan:        { type: DataTypes.STRING(48) },
            description:    { type: DataTypes.STRING(60), allowNull: false },
            qty:            { type: DataTypes.INTEGER, allowNull: false, default: 1 },
            price:          { type: DataTypes.DECIMAL(8,2), allowNull: false },
            subtotal:       { type: DataTypes.DECIMAL(8,2), allowNull: false },
            tax:            { type: DataTypes.DECIMAL(8,2), allowNull: false },
            lastRefresh:    { type: DataTypes.INTEGER, allowNull: false },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("Transactions", {
            id:             { type: DataTypes.UUID, primaryKey: true },
            checkoutTime:   { type: DataTypes.INTEGER, allowNull: false },
            payType:        { type: DataTypes.STRING(12), allowNull: false },
            confirmation:   { type: DataTypes.STRING(255), allowNull: false },
            devicePrint:    { type: DataTypes.STRING, allowNull: false },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        migration.createTable("TransactionItem", {
            transactionId:  { type: DataTypes.UUID, primaryKey: true },
            itemId:         { type: DataTypes.STRING(48), primaryKey: true },
            rawScan:        { type: DataTypes.STRING(48), allowNull: false },
            description:    { type: DataTypes.STRING(60), allowNull: false },
            qty:            { type: DataTypes.INTEGER, allowNull: false },
            price:          { type: DataTypes.DECIMAL(8,2), allowNull: false },
            subtotal:       { type: DataTypes.DECIMAL(8,2), allowNull: false },
            tax:            { type: DataTypes.DECIMAL(8,2), allowNull: false },
            createdAt:      { type: DataTypes.DATE, allowNull: false },
            updatedAt:      { type: DataTypes.DATE, allowNull: false },
            deletedAt:      { type: DataTypes.DATE }
        });

        done();
    },

    down: function(migration, DataTypes, done) {
        migration.dropAllTables(); // no harm, this should be the first migration
        done();
    }
};
