var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element_type = require('./element_type');
var Voltage = require('./voltage');
var Region = require('./region');
var Owner = require('./owner');

var tableName = "elements";
var tableAttributes = ["id", "name", "description", "sil", "stability_limit", "thermal_limit", "element_types_id", "voltages_id"];
//id is primary key
//(name,element_types_id, voltages_id) is unique

var nameSQLVar = "@name";
var typeNameSQLVar = "@typename";
var levelSQLVar = "@level";
var ownerSQLVar = "@owner";
var regionNameSQLVar = "@regionname";
var metadataSQLVar = "@metadata";

var elementTypeIdSQLVar = "@elementtypeid";
var voltageIdSQLVar = "@voltageid";
var elementIdSQLVar = "@elementid";
var regionIdSQLVar = "@regionid";
var ownerIdSQLVar = "@ownerid";

exports.nameSQLVar = nameSQLVar;
exports.typeNameSQLVar = typeNameSQLVar;
exports.levelSQLVar = levelSQLVar;
exports.ownerSQLVar = ownerSQLVar;
exports.regionNameSQLVar = regionNameSQLVar;
exports.metadataSQLVar = metadataSQLVar;

exports.elementTypeIdSQLVar = elementTypeIdSQLVar;
exports.voltageIdSQLVar = voltageIdSQLVar;
exports.elementIdSQLVar = elementIdSQLVar;
exports.regionIdSQLVar = regionIdSQLVar;
exports.ownerIdSQLVar = ownerIdSQLVar;

exports.inputSQLVarNames = [nameSQLVar, typeNameSQLVar, levelSQLVar, ownerSQLVar, regionNameSQLVar, metadataSQLVar];
exports.outputSQLVarNames = [elementTypeIdSQLVar, voltageIdSQLVar, elementIdSQLVar, regionIdSQLVar, ownerIdSQLVar];

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.creationSQL = function () {
    var delimiter = ";";
    var createdSQL = "";

    createdSQL += "SET " + nameSQLVar + " = ?;";
    createdSQL += "SET " + typeNameSQLVar + " = ?;";
    createdSQL += "SET " + levelSQLVar + " = ?;";
    createdSQL += "SET " + ownerSQLVar + " = ?;";
    createdSQL += "SET " + regionNameSQLVar + " = ?;";
    createdSQL += "SET " + metadataSQLVar + " = ?;";

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(Element_type.tableName, [Element_type.tableColumnNames[1]], [typeNameSQLVar], "id", elementTypeIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(Voltage.tableName, [Voltage.tableColumnNames[1]], [levelSQLVar], "id", voltageIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(tableName, [tableAttributes[1], tableAttributes[6], tableAttributes[7]], [nameSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], "id", elementIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(Region.tableName, [Region.tableColumnNames[1]], [regionNameSQLVar], "id", regionIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(Owner.tableName, [Owner.tableColumnNames[1], Owner.tableColumnNames[2], Owner.tableColumnNames[3]], [ownerSQLVar, metadataSQLVar, regionIdSQLVar], "id", ownerIdSQLVar, [Owner.tableColumnNames[1]], [ownerSQLVar]);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString("elements_has_owners", ["elements_id", "owners_id"], [elementIdSQLVar, ownerIdSQLVar]);

    return createdSQL;
};

exports.creationSQL1 = function (nameSQLVar, descriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVar, regionNameSQLVar, stateNameSQLVar) {
    var delimiter = ";";
    var sql = "";
    sql += NewSQLHelper.setVariableSQLString(nameSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(descriptionSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(silSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(stabilityLimitSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(thermalLimitSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(elementTypeNameSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(voltageSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.createSQLInsertIgnoreStatementString(Element_type.tableName, [Element_type.tableColumnNames[1]], [elementTypeNameSQLVar], Element_type.tableColumnNames[0], elementTypeIdSQLVar);
    sql += delimiter;
    sql += NewSQLHelper.createSQLInsertIgnoreStatementString(Voltage.tableName, [Voltage.tableColumnNames[1]], [voltageSQLVar], Voltage.tableColumnNames[0], voltageIdSQLVar);
    sql += delimiter;
    sql += NewSQLHelper.createSQLReplaceStatementString(tableName, tableAttributes.slice(1), [nameSQLVar, descriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], tableAttributes[0], elementIdSQLVar);
    //TODO create owner by ignore strategy
    console.log(sql);
    return sql;
};