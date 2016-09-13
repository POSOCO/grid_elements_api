var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var SQLStatementHelper = require('../helpers/newSQLHelper');
var Element_type = require('./element_type');
var Voltage = require('./voltage');
var Region = require('./region');
var Owner = require('./owner');

var tableName = "elements";
var tableAttributes = ["id", "name", "description", "sil", "stability_limit", "thermal_limit", "element_types_id", "voltages_id"];
//id is primary key
//(name,element_types_id, voltages_id) is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.create = function (elementName, elementTypeName) {
    var delimiter = ";";
    var createdSQL = "";
    createdSQL += "START TRANSACTION READ WRITE;";
    createdSQL += "SET @name = ?;";
    createdSQL += "SET @typename = ?;";
    createdSQL += "SET @level = ?;";
    createdSQL += "SET @owner = ?;";
    createdSQL += "SET @regionname = ?;";
    createdSQL += "SET @metadata = ?;";

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(Element_type.tableName, [Element_type.tableColumnNames[1]], ["@typename"], "id", "@elementtypeid");
    createdSQL += delimiter;

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(Voltage.tableName, [Voltage.tableColumnNames[1]], ["@level"], "id", "@voltageid");
    createdSQL += delimiter;

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(tableName, [tableAttributes[1], tableAttributes[6], tableAttributes[7]], ["@name", "@elementtypeid", "@voltageid"], "id", "@elementid");
    createdSQL += delimiter;

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(Region.tableName, [Region.tableColumnNames[1]], ["@regionname"], "id", "@regionid");
    createdSQL += delimiter;

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString(Owner.tableName, [Owner.tableColumnNames[1], Owner.tableColumnNames[2], Owner.tableColumnNames[3]], ["@owner", "@metadata", "@regionid"], "id", "@ownerid");
    createdSQL += delimiter;

    createdSQL += SQLStatementHelper.createSQLInsertIgnoreStatementString("elements_has_owners", ["elements_id", "owners_id"], ["@elementid", "@ownerid"]);

};