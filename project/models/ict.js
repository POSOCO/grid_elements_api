var db = require('../db.js');
var Element = require('./element');
var ElementType = require('./element_type');
var Voltage = require('./voltage');
var Substation = require('./substation');

var squel = require("squel");
var async = require("async");
var vsprintf = require("sprintf-js").vsprintf;

//create the element and get the elementId
var getIctElementIdByAttrs = exports.getBusReactorElementIdByAttrs = function (voltage, elem_num, mvar, substationNames, substationVoltages, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }

    var tempResults = {
        ictElems: [],
        ictTypeId: null,
        ssTypeId: null,
        voltageId: null,
        ssIds: [],
        ssVoltageIds: []
    };

    var getIctTypeId = function (callback) {
        ElementType.getByTypeWithCreation("ICT", function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elemTypeId = rows[0].id;
            tempResults.ictTypeId = elemTypeId;
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
        var finalVoltages = substationVoltages;
        finalVoltages.push(voltage);
        //console.log(finalVoltages);
        var voltIterators = Array.apply(null, {length: finalVoltages.length}).map(Function.call, Number);
        var getVoltId = function (voltIterator, callback) {
            Voltage.getByLevelWithCreation(finalVoltages[voltIterator], function (err, rows) {
                if (err) {
                    return callback(err);
                }
                var volt = rows[0];
                callback(null, volt);
            }, tempConn)
        };

        //finding each voltage Id
        async.mapSeries(voltIterators, getVoltId, function (err, results) {
            if (err) {
                return callback(err);
            }
            var voltages = results;
            if (voltages.length < 3) {
                return callback(new Error("ICT voltage string is not of the form volt1/volt2"));
            }
            for (var i = 0; i < voltages.length; i++) {
                if (voltages[i].level == voltage) {
                    prevRes.voltageId = voltages[i].id;
                } else {
                    prevRes.ssVoltageIds.push(voltages[i].id);
                }
            }
            callback(null, prevRes);
        });
    };

    var getSSIds = function (prevRes, callback) {
        var elementNamesOrExp = squel.expr();
        for (var i = 0; i < voltage.split('/').length; i++) {
            elementNamesOrExp.or(squel.expr().and(Element.tableColumnNames[1] + " = ?", substationNames[i]).and(Element.tableColumnNames[7] + " = ?", prevRes.ssVoltageIds[i]));
        }

        var elemsWhereExp = squel.expr()
            .and(Element.tableColumnNames[6] + " = ?", prevRes.ssTypeId)
            .and(elementNamesOrExp);

        var getSql = squel.select()
            .field(Element.tableName + ".*")
            .field(Substation.tableName + "." + Substation.tableColumnNames[0], "ss_id")
            .from(Element.tableName)
            .where(elemsWhereExp)
            .order('ss_id')
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
    var getIctElems = function (prevRes, callback) {
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

        var vals = [prevRes.ssIds.join('|||'), prevRes.ictTypeId, prevRes.voltageId, elem_num];
        //console.log(sql);
        //console.log(vals);
        tempConn.query(sql, vals, function (err, rows) {
            if (err) return callback(err);
            var ictElemRows = rows;
            //console.log(ictElemRows);
            prevRes.ictElems = ictElemRows;
            callback(null, prevRes);
        });
    };
    //get the elements_
    var functionsArray = [getIctTypeId, getSSTypeId, getVoltageId, getSSIds, getIctElems];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        done(null, prevRes.ictElems);
    });
};

var getWithCreationWithoutTransaction = exports.getWithCreationWithoutTransaction = function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn) {
    // create bus reactor and get the element id
    var typeName = "ICT";
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var tempResults = {
        elementId: null,
        elements: []
    };

    // find the line Element Id by attributes
    var getIctElemIdByAttrs = function (callback) {
        getIctElementIdByAttrs(voltage, elem_num, thermalLimit, substationNames, substationVoltages, function (err, ictElems) {
            if (err) return callback(err);
            var elementId = null;
            console.log("*************************************************************************************************");
            //console.log(ictElems);
            if (ictElems.length > 0) {
                console.log("ICT Already present...");
                elementId = ictElems[0].id;
            }
            tempResults.elementId = elementId;
            tempResults.elements = ictElems;
            callback(null, tempResults);
        }, tempConn);
    };

    //create the element and get the elementId
    var getElementId = function (prevRes, callback) {
        if (prevRes.elementId != null) {
            console.log("ICT Element creation avoided...");
            return callback(null, prevRes);
        }
        console.log("*************************************************************************************************");
        console.log("ICT not present so creating a new one...");
        var ownerRegions = ownerNames.map(function (x) {
            return "NA";
        });
        Element.getWithCreation(name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
            if (err) return callback(err);
            var elementId = rows[0].id;
            tempResults.elementId = elementId;
            tempResults.elements = rows;
            callback(null, tempResults);
        }, tempConn)
    };

    //create the elements_
    var functionsArray = [getIctElemIdByAttrs, getElementId];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log("From ICT Creation********************");
        console.log(prevRes);
        done(null, prevRes.elements);
    });
};

var getWithCreation = exports.getWithCreation = function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn) {
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
                getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
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
        getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};
