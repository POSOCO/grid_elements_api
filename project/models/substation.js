var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var SQLStatementHelper = require('../helpers/newSQLHelper');
var Element = require('./element');

var tableName = "substations";
var tableAttributes = ["id", "elements_id"];
//id is primary key
//name is unique

var substationIdSQLVar = "@substationid";
exports.substationIdSQLVar = substationIdSQLVar;

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.create_from_scratch = function (name, element_type_name, voltage_level, owner_name, fallback_owner_region_name, fallback_owner_metadata, done) {

    var values = [name, element_type_name, voltage_level, owner_name, fallback_owner_region_name, fallback_owner_metadata];

    var delimiter = ";";
    var space = " ";
    var createdSQL = "";

    //START TRANSACTION
    createdSQL += "START TRANSACTION READ WRITE;";
    //CREATE ELEMENT
    createdSQL += Element.creationSQL();
    createdSQL += delimiter;
    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(tableName, [tableAttributes[1]], [Element.elementIdSQLVar], "id", substationIdSQLVar);
    createdSQL += delimiter;
    //COMMIT THE TRANSACTION
    createdSQL += "COMMIT;";
    //CREATE SUBSTATION AND GET THE ID OF SUBSTATION AND ELEMENT
    createdSQL += "SELECT" + space + substationIdSQLVar + space + "AS" + space + "substationId";
    createdSQL += "," + space;
    createdSQL += Element.elementIdSQLVar + space + "AS" + space + "elementId";
    //console.log("The SQL FOR SUBSTATION CREATION IS \n" + createdSQL);
    db.get().query(createdSQL, values, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};