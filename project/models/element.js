var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element_type = require('./element_type');
var Voltage = require('./voltage');
var Region = require('./region');
var Owner = require('./owner');
var State = require('./state');

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

var creationSQL1 = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVar, ownerMetadataSQLVar, ownerRegionNameSQLVar, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVar, elementRegionIdsSQLVar, stateNamesSQLVar, stateIdsSQLVar, substationsNamesSQLVars, substationsVoltagesSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    sql += NewSQLHelper.setVariableSQLString(elementNameSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(elementDescriptionSQLVar, "?");
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
    if (replace) {
        sql += NewSQLHelper.createSQLReplaceStatementString(tableName, tableAttributes.slice(1), [elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], tableAttributes[0], elementIdSQLVar);
        sql += delimiter;
    } else {
        sql += NewSQLHelper.createSQLInsertIgnoreStatementString(tableName, tableAttributes.slice(1), [elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], tableAttributes[0], elementIdSQLVar, ["name", "element_types_id", "voltages_id"], [elementNameSQLVar, elementTypeIdSQLVar, voltageIdSQLVar]);
        sql += delimiter;
    }
    sql += Owner.creationSQL(ownerNameSQLVar, ownerMetadataSQLVar, ownerRegionNameSQLVar, ownerRegionIdSQLVar, ownerIdSQLVar, false);
    sql += delimiter;
    sql += NewSQLHelper.createSQLReplaceStatementString("elements_has_owners", ["elements_id", "owners_id"], [elementIdSQLVar, ownerIdSQLVar]);
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(elementRegionNamesSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.createSQLInsertIgnoreStatementString(Region.tableName, [Region.tableColumnNames[1]], [elementRegionNamesSQLVar], Region.tableColumnNames[0], elementRegionIdsSQLVar);
    sql += delimiter;
    sql += NewSQLHelper.createSQLReplaceStatementString("elements_has_regions", ["elements_id", "regions_id"], [elementIdSQLVar, elementRegionIdsSQLVar]);
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(stateNamesSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.createSQLInsertIgnoreStatementString(State.tableName, [State.tableColumnNames[1]], [stateNamesSQLVar], State.tableColumnNames[0], stateIdsSQLVar);
    sql += delimiter;
    sql += NewSQLHelper.createSQLReplaceStatementString("elements_has_states", ["elements_id", "states_id"], [elementIdSQLVar, stateIdsSQLVar]);
    //console.log(sql);
    //TODO enable to enter multiple states, regions and owners to an element
    return sql;
};

var create = function (name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerName, ownerMetadata, ownerRegion, region, state, substationNames, substationVoltages, done) {
    var values = [name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerName, ownerMetadata, ownerRegion, region, state];
    var delimiter = ";";
    var elementIdSQLVar = "@elementId";
    var sql = "";
    sql += "START TRANSACTION READ WRITE" + delimiter;
    sql += creationSQL1("@name", "@description", "@sil", "@stabilityLimit", "@thermalLimit", "@typeName", "@typeId", "@voltage", "@voltageId", elementIdSQLVar, "@ownerName", "@ownerMetadata", "@ownerRegion", "@ownerRegionId", "@ownerId", "@regionName", "@regionId", "@stateName", "@stateId", [], [], true);
    sql += delimiter;
    sql += "COMMIT" + delimiter;
    sql += "SELECT " + elementIdSQLVar + " AS elementId" + delimiter;
    console.log(sql + "\n\n\n");
    db.get().query(sql, values, function (err, rows) {
        if (err) return done(err);
        console.log(JSON.stringify(rows));
        done(null, rows);
    });
};

exports.creationSQL1 = creationSQL1;
exports.create = create;
