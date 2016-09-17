var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
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
    createdSQL += NewSQLHelper.createSQLInsertIgnoreStatementString(tableName, [tableAttributes[1]], [Element.elementIdSQLVar], "id", substationIdSQLVar);
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

var creationSQL = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVar, ownerMetadataSQLVar, ownerRegionNameSQLVar, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVar, elementRegionIdsSQLVar, stateNamesSQLVar, stateIdsSQLVar, substationIdSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    //create the element
    sql += Element.creationSQL1(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVar, ownerMetadataSQLVar, ownerRegionNameSQLVar, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVar, elementRegionIdsSQLVar, stateNamesSQLVar, stateIdsSQLVar, true);
    sql += delimiter;
    //create an entry in the substation table
    sql += NewSQLHelper.createSQLReplaceStatementString(tableName, [tableAttributes[1]], [elementIdSQLVar], tableAttributes[0], substationIdSQLVar);
    return sql;
};

exports.create = function (name, description, voltage, ownerName, region, state, done) {
    var values = [name, description, 0, 0, 0, "Substation", voltage, ownerName, "No_Metadata", "NA", region, state];
    var delimiter = ";";
    var substationIdSQLVar = "@substationId";
    var sql = "";
    sql += "START TRANSACTION READ WRITE" + delimiter;
    sql += creationSQL("@name", "@description", "@sil", "@stabilityLimit", "@thermalLimit", "@typeName", "@typeId", "@voltage", "@voltageId", "@elementId", "@ownerName", "@ownerMetadata", "@ownerRegion", "@ownerRegionId", "@ownerId", "@regionName", "@regionId", "@stateName", "@stateId", substationIdSQLVar, true);
    sql += delimiter;
    sql += "COMMIT" + delimiter;
    sql += "SELECT " + substationIdSQLVar + " AS substationId" + delimiter;
    console.log(sql + "\n\n\n");
    db.get().query(sql, values, function (err, rows) {
        if (err) return done(err);
        console.log(JSON.stringify(rows));
        done(null, rows);
    });
};

exports.creationSQL = creationSQL;