/**
 * Bootstrap module for Sequelize migrations. Out of the box, the migration scheme
 * doesn't support smart versioning of the migration application. This module is my
 * implementation of that scheme.
 */
var fs = require("fs"),
    path = require("path"),
    _ = require("lodash"),
    cc = require("change-case");

/**
 * Helper function that tests a filename to ensure that it ends with the ".js"
 * extension and starts with three digits followed by an underscore.
 *
 * @exported-for-testing
 * @private
 * @return {Boolean} true if the filename matches the migration pattern, otherwise false.
 */
var keepOnlyMigrations = 
exports.keepOnlyMigrations = function(filename) {
    return path.extname(filename) == ".js" && /^\d{3}/.test(filename);
};


/**
 * Helper function that build a rich metadata object based on a filename. The object constructed
 * contains filename, which is the original filename, order, which is the filename leading three
 * digits extracted, and desc, which is the reamining part of the filename turned into a title
 * cased description string.
 *
 * @exported-for-testing
 * @private
 * @return {Object}
 */
var toMigrationObj =
exports.toMigrationObj = function(filename) {
    return {
        filename: filename,
        order: filename.substr(0,3),
        desc: cc.titleCase(filename.substr(4, filename.length - 7)) // -7 = 4 for the leading sequence num, 3 for the extension
    };
};


/**
 *
 */
exports.syncDb = function(sequelize) {
    var migrations = _.chain(fs.readdirSync(__dirname))
                      .filter(keepOnlyMigrations)
                      .sortBy()
                      .map(toMigrationObj)
                      .valueOf();

    var last_migration_seq = null; // TODO: get last migration from table
    var result = migrations.every(function(obj) {
        if(_.isNull(last_migration_seq) || parseInt(obj.order) < parseInt(last_migration_seq)) {
            sequelize
                .getMigrator({path: __dirname, filesFilter: obj.filename})
                .migrate({method: "up"})
                .success(function() {
                    // write an updated record in the migration table
                    // commit everything
                })
                .failure(function(err) {
                    // execute the down function
                    // track which migration failed and error message
                });
        }

        return true;
    });

    if(!result) {
        throw new Error("DB migration application failed. The database may be in an inconsistent state.");
    }
};
