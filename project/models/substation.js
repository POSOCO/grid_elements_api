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
    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(tableName, [tableAttributes[1]], [Element.elementIdSQLVar], "id", substationIdSQLVar);
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

var creationSQL = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationIdSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    //create the element
    sql += Element.creationSQL1(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, replace);
    sql += delimiter;
    //create an entry in the substation table
    sql += NewSQLHelper.getSQLInsertReplaceString(tableName, [tableAttributes[1]], [elementIdSQLVar], tableAttributes[0], substationIdSQLVar);
    return sql;
};

exports.create = function (name, description, voltage, ownerNames, regions, states, replace, done) {
    var values = [name, description, voltage];
    var delimiter = ";";
    var substationIdSQLVar = "@substationId";
    var sql = "";

    for (var i = 0; i < ownerNames.length; i++) {
        values.push(ownerNames[i]);
    }
    for (var i = 0; i < regions.length; i++) {
        values.push(regions[i]);
    }
    for (var i = 0; i < states.length; i++) {
        values.push(states[i]);
    }

    sql += "START TRANSACTION READ WRITE" + delimiter;
    var elementNameSQLVar = "@name";
    sql += NewSQLHelper.setVariableSQLString(elementNameSQLVar, "?");
    sql += delimiter;
    var elementDescriptionSQLVar = "@description";
    sql += NewSQLHelper.setVariableSQLString(elementDescriptionSQLVar, "?");
    sql += delimiter;
    var silSQLVar = "@sil";
    sql += NewSQLHelper.setVariableSQLString(silSQLVar, "0");
    sql += delimiter;
    var stabilityLimitSQLVar = "@stabilityLimit";
    sql += NewSQLHelper.setVariableSQLString(stabilityLimitSQLVar, "0");
    sql += delimiter;
    var thermalLimitSQLVar = "@thermalLimit";
    sql += NewSQLHelper.setVariableSQLString(thermalLimitSQLVar, "0");
    sql += delimiter;
    var elementTypeNameSQLVar = "@typeName";
    sql += NewSQLHelper.setVariableSQLString(elementTypeNameSQLVar, "\"Substation\"");
    sql += delimiter;
    var voltageSQLVar = "@voltage";
    sql += NewSQLHelper.setVariableSQLString(voltageSQLVar, "?");
    var ownerNameSQLVar = "@ownerName";
    var ownerMetadataSQLVar = "@ownerMetadata";
    var ownerRegionNameSQLVar = "@ownerRegion";
    var ownerNameSQLVars = [];
    var ownerMetadataSQLVars = [];
    var ownerRegionNameSQLVars = [];
    for (var i = 0; i < ownerNames.length; i++) {
        sql += delimiter;
        ownerNameSQLVars[i] = ownerNameSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(ownerNameSQLVars[i], "?");
        sql += delimiter;
        ownerMetadataSQLVars[i] = ownerMetadataSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(ownerMetadataSQLVars[i], "\"No_Metadata\"");
        sql += delimiter;
        ownerRegionNameSQLVars[i] = ownerRegionNameSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(ownerRegionNameSQLVars[i], "\"NA\"");
    }
    var elementRegionNamesSQLVar = "@regionName";
    var elementRegionNamesSQLVars = [];
    for (var i = 0; i < regions.length; i++) {
        sql += delimiter;
        elementRegionNamesSQLVars[i] = (elementRegionNamesSQLVar + i);
        sql += NewSQLHelper.setVariableSQLString(elementRegionNamesSQLVars[i], "?");
    }
    var stateNamesSQLVar = "@stateName";
    var stateNamesSQLVars = [];
    for (var i = 0; i < states.length; i++) {
        sql += delimiter;
        stateNamesSQLVars[i] = stateNamesSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(stateNamesSQLVars[i], "?");
    }
    sql += delimiter;
    sql += creationSQL(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, "@typeId", voltageSQLVar, "@voltageId", "@elementId", ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, "@ownerRegionId", "@ownerId", elementRegionNamesSQLVars, "@elementRegionId", stateNamesSQLVars, "@stateId", substationIdSQLVar, replace);
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