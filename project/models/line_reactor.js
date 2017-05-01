var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element = require('./element');
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

var getWithCreationWithoutTransaction = exports.getWithCreationWithoutTransaction = function (name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, done, conn) {
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

    //create the element and get the elementId
    var getElementId = function (callback) {
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

    var getLineId = function (prevRes, callback) {
        Line.getWithCreation(line_name, line_name, -1, -1, -1, line_volt, line_num, [], [], [], [], [], "NA", -1, -1, function (err, rows) {
            if (err) return callback(err);
            var lineId = rows[0].id;
            tempResults.lineId = lineId;
            prevRes.lineId = lineId;
            callback(null, prevRes);
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
    var functionsArray = [getElementId, getLineId, getLineReactorId];
    async.waterfall(functionsArray, function (err, prevRes) {
        if (err) return done(err);
        console.log("From Line Reactor Creation********************");
        console.log(prevRes);
        done(null, prevRes.lineReactors);
    });
};

var getWithCreation = exports.getWithCreation = function (name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, done, conn) {
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
                getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, function (err, rows) {
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
        getWithCreationWithoutTransaction(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};
