var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element = require('./element');
var ElementType = require('./element_type');
var Voltage = require('./voltage');
var Substation = require('./substation');
var Line = require('./line');

var tableName = "line_reactors";
var tableAttributes = ["id", "elements_id", "lines_id", "mvar", "is_switchable"];
var squel = require("squel");
var async = require("async");
var vsprintf = require("sprintf-js").vsprintf;
//id is primary key
//(elements_id) is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

//create the element and get the elementId
var getLineReactorElementIdByAttrs = exports.getLineReactorElementIdByAttrs = function (voltage, elem_num, mvar, substationNames, substationVoltages, lines_id, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }

    var tempResults = {
        lrElems: [],
        lrTypeId: null,
        ssTypeId: null,
        voltageId: null,
        ssIds: []
    };

    var getLrTypeId = function (callback) {
        ElementType.getByTypeWithCreation("Line Reactor", function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elemTypeId = rows[0].id;
            tempResults.lrTypeId = elemTypeId;
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
        //console.log(getSql.toString());
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
    var getLrElems = function (prevRes, callback) {
        var sql = "SELECT \
* \
FROM \
( \
SELECT \
ss.substations_id AS ss_id, \
el.*, \
lr.mvar, \
lr.lines_id, \
GROUP_CONCAT( \
DISTINCT ss.substations_id \
ORDER BY \
ss.substations_id ASC SEPARATOR '|||' \
) AS ss_ids \
FROM \
elements AS el \
LEFT JOIN \
elements_has_substations ss ON ss.elements_id = el.id \
LEFT JOIN \
line_reactors lr ON lr.elements_id = el.id \
GROUP BY \
el.id \
ORDER BY \
el.name ASC \
) AS el_tb \
WHERE \
el_tb.ss_ids = ? AND el_tb.element_types_id = ? AND el_tb.voltages_id = ? AND el_tb.elem_num = ? AND el_tb.mvar = ? AND lines_id = ?";

        var vals = [prevRes.ssIds.join('|||'), prevRes.lrTypeId, prevRes.voltageId, elem_num, mvar, lines_id];
        //console.log(sql);
        //console.log(vals);
        tempConn.query(sql, vals, function (err, rows) {
            if (err) return callback(err);
            var lrElemRows = rows;
            console.log(lrElemRows);
            prevRes.lrElems = lrElemRows;
            callback(null, prevRes);
        });
    };
    //get the elements_
    var functionsArray = [getLrTypeId, getSSTypeId, getVoltageId, getSSIds, getLrElems];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        done(null, prevRes.lrElems);
    });
};

var plainCreate = exports.plainCreate = function (element_id, line_id, mvar, is_switchable, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[1], element_id)
        .set(tableAttributes[2], line_id)
        .set(tableAttributes[3], mvar)
        .set(tableAttributes[4], is_switchable);
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
};

var getWithCreationWithoutTransaction = exports.getWithCreationWithoutTransaction = function (name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_substations, line_volt, line_num, mvar, is_switchable, done, conn) {
    // create line reactor and get the element id
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var tempResults = {
        elementId: null,
        lineId: null,
        linReactorId: null,
        elements: [],
        lineReactors: []
    };

    var getLineId = function (callback) {
        var lineVoltages = line_substations.map(function (x) {
            return line_volt;
        });
        Line.getWithCreation(line_name, line_name, -1, -1, -1, line_volt, line_num, [], [], [], line_substations, lineVoltages, "NA", -1, -1, function (err, rows) {
            if (err) return callback(err);
            var lineId = rows[0].id;
            tempResults.lineId = lineId;
            callback(null, tempResults);
        }, tempConn);
    };

    // find the line Element Id by attributes
    var getLrElemIdByAttrs = function (prevRes, callback) {
        getLineReactorElementIdByAttrs(line_volt, elem_num, mvar, substationNames, substationVoltages, prevRes.lineId, function (err, lrElems) {
            if (err) return callback(err);
            var elementId = null;
            console.log("*************************************************************************************************");
            //console.log(lrElems);
            if (lrElems.length > 0) {
                console.log("Line Reactor Already present...");
                elementId = lrElems[0].id;
            }
            prevRes.elementId = elementId;
            prevRes.elements = lrElems;
            callback(null, tempResults);
        }, tempConn);
    };

    //create the element and get the elementId
    var getElementId = function (prevRes, callback) {
        if (prevRes.elementId != null) {
            console.log("Line Reactor Element creation avoided...");
            return callback(null, prevRes);
        }
        console.log("*************************************************************************************************");
        console.log("Line Reactor not present so creating a new one...");
        var ownerRegions = ownerNames.map(function (x) {
            return "NA";
        });
        Element.getWithCreation(name, description, sil, stabilityLimit, thermalLimit, "Line Reactor", line_volt, elem_num, ownerNames, ownerNames, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
            if (err) return callback(err);
            var elementId = rows[0].id;
            tempResults.elementId = elementId;
            tempResults.elements = rows;
            callback(null, tempResults);
        }, tempConn);
    };

    var getLineReactorId = function (prevRes, callback) {
        plainCreate(prevRes.elementId, prevRes.lineId, mvar, is_switchable, function (err, rows) {
            if (err) return callback(err);
            var lineReactorId = rows[0].id;
            tempResults.lineReactorId = lineReactorId;
            tempResults.lineReactors = rows;
            prevRes.lineReactorId = lineReactorId;
            prevRes.lineReactors = rows;
            callback(null, prevRes);
        }, tempConn);
    };

    //create the elements_
    var functionsArray = [getLineId, getLrElemIdByAttrs, getElementId, getLineReactorId];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log("From Line Reactor Creation********************");
        console.log(prevRes);
        done(null, prevRes.lineReactors);
    });
};

var getWithCreation = exports.getWithCreation = function (name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_substations, line_volt, line_num, mvar, is_switchable, done, conn) {
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
                getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_substations, line_volt, line_num, mvar, is_switchable, function (err, rows) {
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
        getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_substations, line_volt, line_num, mvar, is_switchable, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};
