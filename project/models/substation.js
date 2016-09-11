var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');

var tableName  = "substations";
var tableAttributes = ["id", "elements_id"];
//id is primary key
//name is unique

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.create = function (names, done) {
    if (!(names.constructor === Array)) {
        names = [[names]];
    }
    var argNames = [tableAttributes[1]];
    var values = [names];
    var createdSQL = SQLHelper.createSQLInsertString(tableName, argNames, values);
    //console.log("conductor_types insert query is " + JSON.stringify(createdSQL));
    db.get().query(createdSQL['SQLQueryString'], createdSQL['SQLQueryValues'], function (err, result) {
        if (err) return done(err);
        done(null, result.affectedRows);
    });
};