var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName  = "element_types";
var tableAttributes = ["id", "type"];
//id is primary key
//type is unique
exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getByType = function (type, done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [tableAttributes[1]], ['=']), [type], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.create = function (types, done) {
    if (!(types.constructor === Array)) {
        types = [[types]];
    }
    var argNames = [tableAttributes[1]];
    var values = [types];
    var createdSQL = SQLHelper.createSQLInsertString(tableName, argNames, values);
    //console.log("states insert query is " + JSON.stringify(createdSQL));
    db.get().query(createdSQL['SQLQueryString'], createdSQL['SQLQueryValues'], function (err, result) {
        if (err) return done(err);
        done(null, result.affectedRows);
    });
};