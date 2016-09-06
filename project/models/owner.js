var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName  = "owners";
var tableAttributes = ["id", "name", "metadata", "region_id"];
//id is primary key
//name is unique

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getByName = function (name, done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], ['name'], ['=']), [name], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.forceCreate = function (names, done) {
    //force creation can be done by http://stackoverflow.com/questions/1361340/how-to-insert-if-not-exists-in-mysql
    if (!(names.constructor === Array)) {
        names = [[names]];
    }
    var argNames = [tableAttributes[1]];
    var values = [names];
    var createdSQL = SQLHelper.createSQLInsertString(tableName, argNames, values);
    //console.log("regions insert query is " + JSON.stringify(createdSQL));
    db.get().query(createdSQL['SQLQueryString'], createdSQL['SQLQueryValues'], function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    });
};
