/**
 * The Consumer entity represents an identity of mobile application user that
 * shops and checks out at a retail location.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Consumer", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        // the device print is a comma seperated string of various platform
        // fields that we can get from the device.
        //
        // platform=xxx,version=yyy,id=zzz,updated=20141015121314
        // where 
        //      xxx is the platform name returned by Cordova (e.g. "ios", "android", etc)
        //      yyy is the semver of the platform
        //      zzz is the UUID as defined by Cordova
        //
        // updated is the UTC timestamp in YYYYMMddHHmmss form
        //
        devicePrint:      DataTypes.STRING,
        parentConsumer:   DataTypes.UUID
   }, {paranoid: true});
};
