var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element_type = require('./element_type');
var Voltage = require('./voltage');
var Region = require('./region');
var Owner = require('./owner');
var State = require('./state');
var Substation = require('./substation');

var tableName = "elements";
var tableAttributes = ["id", "name", "description", "sil", "stability_limit", "thermal_limit", "element_types_id", "voltages_id"];
var sequel = require("sequel");
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

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(Element_type.tableName, [Element_type.tableColumnNames[1]], [typeNameSQLVar], "id", elementTypeIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(Voltage.tableName, [Voltage.tableColumnNames[1]], [levelSQLVar], "id", voltageIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(tableName, [tableAttributes[1], tableAttributes[6], tableAttributes[7]], [nameSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], "id", elementIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(Region.tableName, [Region.tableColumnNames[1]], [regionNameSQLVar], "id", regionIdSQLVar);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString(Owner.tableName, [Owner.tableColumnNames[1], Owner.tableColumnNames[2], Owner.tableColumnNames[3]], [ownerSQLVar, metadataSQLVar, regionIdSQLVar], "id", ownerIdSQLVar, [Owner.tableColumnNames[1]], [ownerSQLVar]);
    createdSQL += delimiter;

    createdSQL += NewSQLHelper.getSQLInsertIgnoreString("elements_has_owners", ["elements_id", "owners_id"], [elementIdSQLVar, ownerIdSQLVar]);

    return createdSQL;
};

var creationSQL1 = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationNameSQLVars, substationVoltageSQLVars, replace) {
    var sql = "";
    var delimiter = ";";
    sql += NewSQLHelper.getSQLInsertIgnoreString(Element_type.tableName, [Element_type.tableColumnNames[1]], [elementTypeNameSQLVar], Element_type.tableColumnNames[0], elementTypeIdSQLVar);
    sql += delimiter;
    sql += NewSQLHelper.getSQLInsertIgnoreString(Voltage.tableName, [Voltage.tableColumnNames[1]], [voltageSQLVar], Voltage.tableColumnNames[0], voltageIdSQLVar);
    if (replace) {
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertReplaceString(tableName, tableAttributes.slice(1), [elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], tableAttributes[0], elementIdSQLVar);
    } else {
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertIgnoreString(tableName, tableAttributes.slice(1), [elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeIdSQLVar, voltageIdSQLVar], tableAttributes[0], elementIdSQLVar, ["name", "element_types_id", "voltages_id"], [elementNameSQLVar, elementTypeIdSQLVar, voltageIdSQLVar]);
    }
    for (var i = 0; i < ownerNameSQLVars.length; i++) {
        sql += delimiter;
        sql += Owner.creationSQL(ownerNameSQLVars[i], ownerMetadataSQLVars[i], ownerRegionNameSQLVars[i], ownerRegionIdSQLVar, ownerIdSQLVar, false);
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertReplaceString("elements_has_owners", ["elements_id", "owners_id"], [elementIdSQLVar, ownerIdSQLVar]);
    }
    for (var i = 0; i < elementRegionNamesSQLVars.length; i++) {
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertIgnoreString(Region.tableName, [Region.tableColumnNames[1]], [elementRegionNamesSQLVars[i]], Region.tableColumnNames[0], elementRegionIdsSQLVar);
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertReplaceString("elements_has_regions", ["elements_id", "regions_id"], [elementIdSQLVar, elementRegionIdsSQLVar]);
    }
    for (var i = 0; i < stateNamesSQLVars.length; i++) {
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertIgnoreString(State.tableName, [State.tableColumnNames[1]], [stateNamesSQLVars[i]], State.tableColumnNames[0], stateIdsSQLVar);
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertReplaceString("elements_has_states", ["elements_id", "states_id"], [elementIdSQLVar, stateIdsSQLVar]);
    }

    if (substationNameSQLVars.length > 0) {
        sql += delimiter;
        var tempSSDescriptionSQLVar = "@tempSSDescription";
        sql += NewSQLHelper.setVariableSQLString(tempSSDescriptionSQLVar, "\"No Description\"");
        sql += delimiter;
        var tempSSsilSQLVar = "@tempSSSil";
        sql += NewSQLHelper.setVariableSQLString(tempSSsilSQLVar, "0");
        sql += delimiter;
        var tempSSstabilityLimitSQLVar = "@tempSSStabilityLimit";
        sql += NewSQLHelper.setVariableSQLString(tempSSstabilityLimitSQLVar, "0");
        sql += delimiter;
        var tempSSthermalLimitSQLVar = "@tempSSThermalLimit";
        sql += NewSQLHelper.setVariableSQLString(tempSSthermalLimitSQLVar, "0");
        sql += delimiter;
        var tempSSelementTypeNameSQLVar = "@tempSSTypeName";
        sql += NewSQLHelper.setVariableSQLString(tempSSelementTypeNameSQLVar, "\"Substation\"");
    }
    for (var i = 0; i < substationNameSQLVars.length; i++) {
        var tempSSsubstationIdSQLVar = "@tempSSSubstationId";
        sql += delimiter;
        sql += Substation.creationSQL(substationNameSQLVars[i], tempSSDescriptionSQLVar, tempSSsilSQLVar, tempSSstabilityLimitSQLVar, tempSSthermalLimitSQLVar, tempSSelementTypeNameSQLVar, "@tempSSTypeId", substationVoltageSQLVars[i], "@tempSSVoltageId", "@tempSSElementId", [], [], [], "@tempSSOwnerRegionId", "@tempSSOwnerId", [], "@tempSSElementRegionId", [], "@tempSSStateId", tempSSsubstationIdSQLVar, false);
        sql += delimiter;
        sql += NewSQLHelper.getSQLInsertReplaceString("elements_has_substations", ["elements_id", "substations_id"], [elementIdSQLVar, tempSSsubstationIdSQLVar]);
    }

    //console.log(sql);
    return sql;
};

var create = function (name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done) {
    var values = [name, description, sil, stabilityLimit, thermalLimit, typeName, voltage];
    for (var i = 0; i < ownerNames.length; i++) {
        values.push(ownerNames[i]);
        values.push(ownerMetadatas[i]);
        values.push(ownerRegions[i]);
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

    var sql = "";
    var delimiter = ";";

    var elementIdSQLVar = "@elementId";

    var elementNameSQLVar = "@name";
    var elementDescriptionSQLVar = "@description";
    var silSQLVar = "@sil";
    var stabilityLimitSQLVar = "@stabilityLimit";
    var thermalLimitSQLVar = "@thermalLimit";
    var elementTypeNameSQLVar = "@typeName";
    var voltageSQLVar = "@voltage";
    var elementRegionNamesSQLVar = "@regionName";
    var stateNamesSQLVar = "@stateName";

    var ownerNameSQLVar = "@ownerName";
    var ownerMetadataSQLVar = "@ownerMetadata";
    var ownerRegionNameSQLVar = "@ownerRegion";

    var substationNameSQLVar = "@substationName";
    var substationVoltageSQLVar = "@substationVoltage";

    sql += "START TRANSACTION READ WRITE" + delimiter;

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

    var ownerNameSQLVars = [];
    var ownerMetadataSQLVars = [];
    var ownerRegionNameSQLVars = [];
    for (var i = 0; i < ownerNames.length; i++) {
        ownerNameSQLVars[i] = ownerNameSQLVar + i;
        ownerMetadataSQLVars[i] = ownerMetadataSQLVar + i;
        ownerRegionNameSQLVars[i] = ownerRegionNameSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(ownerNameSQLVars[i], "?");
        sql += delimiter;
        sql += NewSQLHelper.setVariableSQLString(ownerMetadataSQLVars[i], "?");
        sql += delimiter;
        sql += NewSQLHelper.setVariableSQLString(ownerRegionNameSQLVars[i], "?");
        sql += delimiter;
    }

    var elementRegionNamesSQLVars = [];
    for (var i = 0; i < regions.length; i++) {
        elementRegionNamesSQLVars[i] = elementRegionNamesSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(elementRegionNamesSQLVars[i], "?");
        sql += delimiter;
    }

    var stateNamesSQLVars = [];
    for (var i = 0; i < states.length; i++) {
        stateNamesSQLVars[i] = stateNamesSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(stateNamesSQLVars[i], "?");
        sql += delimiter;
    }

    var substationNameSQLVars = [];
    var substationVoltageSQLVars = [];
    for (var i = 0; i < substationNames.length; i++) {
        substationNameSQLVars[i] = substationNameSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(substationNameSQLVars[i], "?");
        sql += delimiter;
        substationVoltageSQLVars[i] = substationVoltageSQLVar + i;
        sql += NewSQLHelper.setVariableSQLString(substationVoltageSQLVars[i], "?");
        sql += delimiter;
    }

    sql += creationSQL1(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, "@typeId", voltageSQLVar, "@voltageId", elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, "@ownerRegionId", "@ownerId", elementRegionNamesSQLVars, "@regionId", stateNamesSQLVars, "@stateId", substationNameSQLVars, substationVoltageSQLVars, true);
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

exports.elementSubstationCreate = function (substationNames, substationVoltages, elementIds, done) {
    var sql = "";
    var delimiter = ";";
    var values = [];
    sql += "START TRANSACTION READ WRITE;";
    for (var i = 0; i < substationNames.length; i++) {
        sql += "SET @subId = (SELECT substations.id FROM elements LEFT OUTER JOIN substations ON substations.elements_id = elements.id LEFT OUTER JOIN voltages ON voltages.id = elements.voltages_id WHERE elements.name = ? AND voltages.level = ?);"
        sql += NewSQLHelper.getSQLInsertReplaceString("elements_has_substations", ["elements_id", "substations_id"], ["?", "@subId"]);
        sql += delimiter;
        values.push(substationNames[i], substationVoltages[i], elementIds[i]);
    }
    sql += "COMMIT";
    console.log(sql + "\n\n\n");
    db.get().query(sql, values, function (err, rows) {
        if (err) return done(err);
        console.log(JSON.stringify(rows));
        done(null, rows);
    });
};

var getWithCreationWithoutTransaction = exports.getWithCreationWithoutTransaction = function (name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn) {
    var tempConn = conn;
    //todo complete this
    //ignore substation creation first for testing purpose

};

exports.getWithCreation = function (name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        db.getPoolConnection(function (err, poolConnection) {
            if (err) return done(err);
            tempConn = poolConnection;
            tempConn.beginTransaction(function (err) {
                //console.log("transaction started...");
                if (err) {
                    return done(err);
                }
                getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
                    if (err) {
                        //console.log("error in owner name creation...");
                        tempConn.rollback(function () {
                            //console.log("transaction rollback done ...");
                            return done(err);
                        });
                        return;
                    }
                    tempConn.commit(function (err) {
                        if (err) {
                            //console.log("error in transaction commit ...");
                            tempConn.rollback(function () {
                                //console.log("error in transaction commit rollback ...");
                                return done(err);
                            });
                        }
                        //console.log("transaction committed successfully ...");
                        done(null, rows);
                    });
                }, tempConn);
            });
        });
    } else {
        getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};

exports.creationSQL1 = creationSQL1;
exports.create = create;
