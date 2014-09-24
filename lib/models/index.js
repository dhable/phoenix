/**
 * Root level module definition for the 'models' namespace. Here is where
 * the SQL database connection is managed and objects mapping to the tables
 * in the SQL database are stored.
 *
 * @module models
 */
var fs = require("fs"),
    path = require("path"),
    changeCase = require("change-case"),
    sequelize = require("sequelize");


// Create an instance of the sequelize engine.
var engine = new sequelize("pos", "jetway", "jetway", {
   dialect: "sqlite",
   storage: "../../.db"
});


// Perform a bit of dynamic magic here to loop over all the source files, which
// should contain entity model definitions and use the new SQL engine to import
// their definition. Then mangle the file name into an object name and add to the
// exports for this module.
fs.readdirSync(__dirname).forEach(function(file) {
   var baseName = path.basename(file, ".js"),
       extension = path.extname(file),
       absPath = path.resolve(__dirname, file),
       objName = changeCase.ucFirst(changeCase.camelCase(baseName));

   if(extension === ".js" && baseName !== "index") {
      exports[objName] = engine.import(absPath);
   }
});


// TODO: Add some logic here that builds relationships between the various
//       entity objects.
