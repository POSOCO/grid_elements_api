var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element = require('./element');

var tableName = "bus_reactors";
var tableAttributes = ["id", "elements_id", "mvar"];
//id is primary key
//elements_id is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

var creationSQL = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, mvarSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, noLoadMvarSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationNameSQLVars, substationVoltageSQLVars, brIdSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    //create the element
    sql += Element.creationSQL1(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationNameSQLVars, substationVoltageSQLVars, brIdSQLVar, replace);
    sql += delimiter;
    //create an entry in the bus_reactors table
    sql += NewSQLHelper.getSQLInsertReplaceString(tableName, tableAttributes.slice(1), [elementIdSQLVar, mvarSQLVar], tableAttributes[0], brIdSQLVar);
    return sql;
};

exports.create = function (name, description, voltage, sil, mvar, ownerNames, regions, states, substationNames, substationVoltages, replace, done) {
    var values = [name, description, voltage, mvar];
    var delimiter = ";";
    var brIdSQLVar = "@brId";
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
    for (var i = 0; i < substationNames.length; i++) {
        values.push(substationNames[i]);
        values.push(substationVoltages[i]);
    }

    sql += "START TRANSACTION READ WRITE" + delimiter;
    var elementNameSQLVar = "@name";
    sql += NewSQLHelper.setVariableSQLString(elementNameSQLVar, "?");
    sql += delimiter;
    var elementDescriptionSQLVar = "@description";
    sql += NewSQLHelper.setVariableSQLString(elementDescriptionSQLVar, "?");
    sql += delimiter;

    var stabilityLimitSQLVar = "@stabilityLimit";
    sql += NewSQLHelper.setVariableSQLString(stabilityLimitSQLVar, "0");
    sql += delimiter;
    var thermalLimitSQLVar = "@thermalLimit";
    sql += NewSQLHelper.setVariableSQLString(thermalLimitSQLVar, "0");
    sql += delimiter;
    var elementTypeNameSQLVar = "@typeName";
    sql += NewSQLHelper.setVariableSQLString(elementTypeNameSQLVar, "\"Bus Reactor\"");
    sql += delimiter;
    var voltageSQLVar = "@voltage";
    sql += NewSQLHelper.setVariableSQLString(voltageSQLVar, "?");

    sql += delimiter;
    var silSQLVar = "@sil";
    sql += NewSQLHelper.setVariableSQLString(silSQLVar, "0");

    sql += delimiter;
    var mvarSQLVar = "@brMvar";
    sql += NewSQLHelper.setVariableSQLString(mvarSQLVar, "?");

    sql += delimiter;
    var noLoadMvarSQLVar = "@noLoadMvar";
    sql += NewSQLHelper.setVariableSQLString(noLoadMvarSQLVar, "0");

    var ownerNameSQLVar = "@ownerName";
    var ownerMetadataSQLVar = "@ownerMetadata";
    var ownerRegionNameSQLVar = "@ownerRegion";
    var ownerNameSQLVars = [];
    var ownerMetadataSQLVars = [];
    var ownerRegionNameSQLVars = [];

    var substationNameSQLVar = "@substationName";
    var substationVoltageSQLVar = "@substationVoltage";

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
    var substationNameSQLVars = [];
    var substationVoltageSQLVars = [];
    for (var i = 0; i < substationNames.length; i++) {
        sql += delimiter;
        substationNameSQLVars[i] = substationNameSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(substationNameSQLVars[i], "?");
        sql += delimiter;
        substationVoltageSQLVars[i] = substationVoltageSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(substationVoltageSQLVars[i], "?");
    }
    sql += delimiter;
    sql += creationSQL(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, mvarSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, "@typeId", voltageSQLVar, "@voltageId", noLoadMvarSQLVar, "@elementId", ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, "@ownerRegionId", "@ownerId", elementRegionNamesSQLVars, "@elementRegionId", stateNamesSQLVars, "@stateId", substationNameSQLVars, substationVoltageSQLVars, brIdSQLVar, replace);
    sql += delimiter;
    sql += "COMMIT" + delimiter;
    sql += "SELECT " + brIdSQLVar + " AS brId" + delimiter;
    console.log(sql + "\n\n\n");
    console.log(values);
    db.get().query(sql, values, function (err, rows) {
        if (err) return done(err);
        //console.log(JSON.stringify(rows));
        done(null, rows);
    });
};

exports.creationSQL = creationSQL;