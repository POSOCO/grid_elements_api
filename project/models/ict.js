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
        ssIds: []
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

    // tableAttributes = ["id", "name", "description", "sil", "stability_limit", "thermal_limit", "element_types_id", "voltages_id", "elem_num"];
    var getIctElems = function (prevRes, callback) {
        //stub
        var getSql = squel.select()
            .from(Element.tableName)
            .where(
            squel.expr()
                .and("element_types_id = ?", prevRes.ictTypeId)
                .and("voltages_id = ?", prevRes.voltageId)
                .and("elem_num = ?", elem_num)
                .and("thermal_limit = ?", mvar)
        );

        var vals = [prevRes.ictTypeId, prevRes.voltageId, elem_num, mvar];
        //console.log(getSql.toString());
        tempConn.query(getSql.toParam().text, getSql.toParam().values, function (err, rows) {
            if (err) return callback(err);
            var ictElemRows = rows;
            //console.log(ictElemRows);
            prevRes.ictElems = ictElemRows;
            callback(null, prevRes);
        });
    };
    //get the elements_
    var functionsArray = [getIctTypeId, getVoltageId, getIctElems];
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
