var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element = require('./element');
var ElementType = require('./element_type');
var Conductor_Type = require('./conductor_type');
var Substation = require('./substation');
var Voltage = require('./voltage');

var tableName = "`lines`";
var tableAttributes = ["id", "elements_id", "conductor_types_id", "line_length", "noloadmvar"];
var squel = require("squel");
var async = require("async");
var vsprintf = require("sprintf-js").vsprintf;
//id is primary key
//(elements_id) is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

var creationSQL = function (elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, conductorTypeIdSQLVar, lineNumberSQLVar, lineLengthSQLVar, noLoadMvarSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationNameSQLVars, substationVoltageSQLVars, lineIdSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    //create the element
    sql += Element.creationSQL1(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, elementTypeIdSQLVar, voltageSQLVar, voltageIdSQLVar, elementIdSQLVar, ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, ownerRegionIdSQLVar, ownerIdSQLVar, elementRegionNamesSQLVars, elementRegionIdsSQLVar, stateNamesSQLVars, stateIdsSQLVar, substationNameSQLVars, substationVoltageSQLVars, lineIdSQLVar, replace);
    sql += delimiter;
    //create an entry in the lines table
    sql += NewSQLHelper.getSQLInsertReplaceString(tableName, tableAttributes.slice(1), [elementIdSQLVar, conductorTypeIdSQLVar, lineNumberSQLVar, lineLengthSQLVar, noLoadMvarSQLVar], tableAttributes[0], lineIdSQLVar);
    return sql;
};

exports.create = function (name, description, voltage, conductorType, sil, lineNumber, lineLength, noLoadMvar, ownerNames, regions, states, substationNames, substationVoltages, replace, done) {
    var values = [name, description, voltage, conductorType, sil, lineNumber, lineLength, noLoadMvar];
    var delimiter = ";";
    var lineIdSQLVar = "@lineId";
    var conductorTypeIdSQLVar = "@conductorTypeId";
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
    sql += NewSQLHelper.setVariableSQLString(elementTypeNameSQLVar, "\"Line\"");
    sql += delimiter;
    var voltageSQLVar = "@voltage";
    sql += NewSQLHelper.setVariableSQLString(voltageSQLVar, "?");

    sql += delimiter;
    var conductorTypeSQLVar = "@conductorType";
    sql += NewSQLHelper.setVariableSQLString(conductorTypeSQLVar, "?");

    sql += delimiter;
    var silSQLVar = "@sil";
    sql += NewSQLHelper.setVariableSQLString(silSQLVar, "?");

    sql += delimiter;
    var lineNumberSQLVar = "@lineNumber";
    sql += NewSQLHelper.setVariableSQLString(lineNumberSQLVar, "?");

    sql += delimiter;
    var lineLengthSQLVar = "@lineLength";
    sql += NewSQLHelper.setVariableSQLString(lineLengthSQLVar, "?");

    sql += delimiter;
    var noLoadMvarSQLVar = "@noLoadMvar";
    sql += NewSQLHelper.setVariableSQLString(noLoadMvarSQLVar, "?");

    var ownerNameSQLVar = "@ownerName";
    var ownerMetadataSQLVar = "@ownerMetadata";
    var ownerRegionNameSQLVar = "@ownerRegion";
    var ownerNameSQLVars = [];
    var ownerMetadataSQLVars = [];
    var ownerRegionNameSQLVars = [];

    var substationNameSQLVar = "@substationName";
    var substationVoltageSQLVar = "@substationVoltage";

    sql += delimiter;
    sql += NewSQLHelper.getSQLInsertIgnoreString("conductor_types", ["name"], [conductorTypeSQLVar], "id", conductorTypeIdSQLVar);

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
    sql += creationSQL(elementNameSQLVar, elementDescriptionSQLVar, silSQLVar, stabilityLimitSQLVar, thermalLimitSQLVar, elementTypeNameSQLVar, "@typeId", voltageSQLVar, "@voltageId", conductorTypeIdSQLVar, lineNumberSQLVar, lineLengthSQLVar, noLoadMvarSQLVar, "@elementId", ownerNameSQLVars, ownerMetadataSQLVars, ownerRegionNameSQLVars, "@ownerRegionId", "@ownerId", elementRegionNamesSQLVars, "@elementRegionId", stateNamesSQLVars, "@stateId", substationNameSQLVars, substationVoltageSQLVars, lineIdSQLVar, replace);
    sql += delimiter;
    sql += "COMMIT" + delimiter;
    sql += "SELECT " + lineIdSQLVar + " AS lineId" + delimiter;
    console.log(sql + "\n\n\n");
    console.log(values);
    db.get().query(sql, values, function (err, rows) {
        if (err) return done(err);
        //console.log(JSON.stringify(rows));
        done(null, rows);
    });
};

//create the element and get the elementId
var getLineElementIdByAttrs = exports.getLineElementIdByAttrs = function (voltage, elem_num, substationNames, substationVoltages, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }

    var tempResults = {
        lineElems: [],
        lineTypeId: null,
        ssTypeId: null,
        voltageId: null,
        ssIds: []
    };

    var getLineTypeId = function (callback) {
        ElementType.getByTypeWithCreation("Line", function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elemTypeId = rows[0].id;
            tempResults.lineTypeId = elemTypeId;
            callback(null, tempResults);
        }, tempConn);
    };

    var getSSTypeId = function (prevRes, callback) {
        ElementType.getByTypeWithCreation("Substation", function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elemTypeId = rows[0].id;
            prevRes.ssTypeId = elemTypeId;
            callback(null, prevRes);
        }, tempConn);
    };

    var getVoltageId = function (prevRes, callback) {
        Voltage.getByLevelWithCreation(voltage, function (err, rows) {
            if (err) {
                return callback(err);
            }
            var voltageId = rows[0].id;
            prevRes.voltageId = voltageId;
            callback(null, prevRes);
        }, tempConn);
    };

    var getSSIds = function (prevRes, callback) {
        var elementNamesOrExp = squel.expr();
        for (var i = 0; i < substationNames.length; i++) {
            elementNamesOrExp.or(squel.expr().and(Element.tableColumnNames[1] + " = ?", substationNames[i]).and(Element.tableColumnNames[7] + " = ?", prevRes.voltageId));
        }

        var elemsWhereExp = squel.expr()
            .and(Element.tableColumnNames[6] + " = ?", prevRes.ssTypeId)
            .and(elementNamesOrExp);

        var getSql = squel.select()
            .field(Element.tableName + ".*")
            .field(Substation.tableName + "." + Substation.tableColumnNames[0], "ss_id")
            .from(Element.tableName)
            .where(elemsWhereExp)
            .join(Substation.tableName, null, "elements.id = substations.elements_id");

        var query = getSql.toParam().text;
        var vals = getSql.toParam().values;
        console.log(getSql.toString());
        tempConn.query(query, vals, function (err, rows) {
            if (err) return callback(err);
            var ssRows = rows;
            //console.log(ssRows);
            for (var i = 0; i < ssRows.length; i++) {
                prevRes.ssIds.push(ssRows[i].ss_id);
            }
            callback(null, prevRes);
        });
    };

    // tableAttributes = ["id", "name", "description", "sil", "stability_limit", "thermal_limit", "element_types_id", "voltages_id", "elem_num"];
    var getLineElems = function (prevRes, callback) {
        var sql = "SELECT \
* \
FROM \
( \
SELECT \
ss.substations_id AS ss_id, \
el.*, \
GROUP_CONCAT( \
DISTINCT ss.substations_id \
ORDER BY \
ss.substations_id ASC SEPARATOR '|||' \
) AS ss_ids \
FROM \
elements AS el \
LEFT JOIN \
elements_has_substations ss ON ss.elements_id = el.id \
GROUP BY \
el.id \
ORDER BY \
el.name ASC \
) AS el_tb \
WHERE \
el_tb.ss_ids = ? AND el_tb.element_types_id = ? AND el_tb.voltages_id = ? AND el_tb.elem_num = ?";

        var vals = [prevRes.ssIds.join('|||'), prevRes.lineTypeId, prevRes.voltageId, elem_num];
        //console.log(sql);
        //console.log(vals);
        tempConn.query(sql, vals, function (err, rows) {
            if (err) return callback(err);
            var lineElemRows = rows;
            //console.log(lineElemRows);
            prevRes.lineElems = lineElemRows;
            callback(null, prevRes);
        });
    };
    //get the elements_
    var functionsArray = [getLineTypeId, getSSTypeId, getVoltageId, getSSIds, getLineElems];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        done(null, prevRes.lineElems);
    });
};

var plainCreate = exports.plainCreate = function (element_id, cond_type, line_len, no_load_mvar, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var getConductorTypeId = function (callback) {
        Conductor_Type.getByNameWithCreation(cond_type, function (err, rows) {
            if (err) return callback(err);
            var cond_type_id = rows[0].id;
            callback(null, {cond_type_id: cond_type_id});
        }, tempConn);
    };
    var functionsArray = [getConductorTypeId];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        //tableAttributes = ["id", "elements_id", "conductor_types_id", "line_length", "noloadmvar"];
        var sql = squel.insert()
            .into(tableName)
            .set(tableAttributes[1], element_id)
            .set(tableAttributes[2], prevRes.cond_type_id)
            .set(tableAttributes[3], line_len)
            .set(tableAttributes[4], no_load_mvar);
        var query = sql.toParam().text;
        //query += " ON DUPLICATE KEY UPDATE name = name;";
        query += vsprintf(" ON DUPLICATE KEY UPDATE %s = %s;", [tableAttributes[1], tableAttributes[1]]);
        var getSql = squel.select()
            .from(tableName)
            .where(
            squel.expr()
                .and(tableAttributes[1] + " = ?", element_id)
        );
        query += getSql.toParam().text;
        var vals = sql.toParam().values.concat(getSql.toParam().values);
        //console.log(query);
        //console.log(vals);
        tempConn.query(query, vals, function (err, rows) {
            if (err) return done(err);
            done(null, rows[1]);
        });
    });
};

var getWithCreationWithoutTransaction = exports.getWithCreationWithoutTransaction = function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, done, conn) {
    // create bus reactor and get the element id
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var tempResults = {
        elementId: null,
        lineId: null,
        elements: [],
        lines: []
    };

    // find the line Element Id by attributes
    var getLineElemIdByAttrs = function (callback) {
        getLineElementIdByAttrs(voltage, elem_num, substationNames, substationVoltages, function (err, lineElems) {
            if (err) return callback(err);
            var elementId = null;
            console.log("*************************************************************************************************");
            //console.log(lineElems);
            if (lineElems.length > 0) {
                console.log("Line Already present...");
                elementId = lineElems[0].id;
            }
            tempResults.elementId = elementId;
            tempResults.elements = lineElems;
            callback(null, tempResults);
        }, tempConn);
    };

    //create the element and get the elementId
    var getElementId = function (prevRes, callback) {
        if (prevRes.elementId != null) {
            console.log("Line Element creation avoided...");
            return callback(null, prevRes);
        }
        console.log("*************************************************************************************************");
        console.log("Line not present so creating a new one...");
        var ownerRegions = ownerNames.map(function (x) {
            return "NA";
        });
        Element.getWithCreation(name, description, sil, stabilityLimit, thermalLimit, "Line", voltage, elem_num, ownerNames, ownerNames, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
            if (err) return callback(err);
            var elementId = rows[0].id;
            prevRes.elementId = elementId;
            prevRes.elements = rows;
            callback(null, prevRes);
        }, tempConn)
    };

    var getLineId = function (prevRes, callback) {
        plainCreate(prevRes.elementId, cond_type, line_len, no_load_mvar, function (err, rows) {
            if (err) return callback(err);
            var lineId = rows[0].id;
            tempResults.lineId = lineId;
            tempResults.lines = rows;
            prevRes.lineId = lineId;
            prevRes.lines = rows;
            callback(null, prevRes);
        }, tempConn)
    };

    //create the elements_
    var functionsArray = [getLineElemIdByAttrs, getElementId, getLineId];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log("From Line Creation********************");
        console.log(prevRes);
        done(null, prevRes.lines);
    });
};

var getWithCreation = exports.getWithCreation = function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        db.getPoolConnection(function (err, poolConnection) {
            if (err) return done(err);
            tempConn = poolConnection;
            tempConn.beginTransaction(function (err) {
                //console.log("transaction started...");
                if (err) {
                    tempConn.release();
                    return done(err);
                }
                getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, function (err, rows) {
                    if (err) {
                        //console.log("error in owner name creation...");
                        tempConn.rollback(function () {
                            //console.log("transaction rollback done ...");
                            tempConn.release();
                            return done(err);
                        });
                        return;
                    }
                    tempConn.commit(function (err) {
                        if (err) {
                            //console.log("error in transaction commit ...");
                            tempConn.rollback(function () {
                                //console.log("error in transaction commit rollback ...");
                                tempConn.release();
                                return done(err);
                            });
                        }
                        //console.log("transaction committed successfully ...");
                        tempConn.release();
                        done(null, rows);
                    });
                }, tempConn);
            });
        });
    } else {
        getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};

exports.creationSQL = creationSQL;