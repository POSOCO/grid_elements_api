var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName  = "conductor_types";
var tableAttributes = ["id", "name"];
var squel = require("squel");
//id is primary key
//name is unique

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getByName = function (name, done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [tableAttributes[1]], ['=']), [name], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getByNameWithCreation = function (name, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[1], name);
    var query = sql.toParam().text;
    query += " ON DUPLICATE KEY UPDATE name = name;";
    var getSql = squel.select()
        .from(tableName)
        .where(
        squel.expr()
            .and(tableAttributes[1] + " = ?", name)
    );
    query += getSql.toParam().text;
    var vals = sql.toParam().values.concat(getSql.toParam().values);
    //console.log(query + getSql.toParam().text);
    //console.log(sql.toParam().values.concat(getSql.toParam().values));
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows[1]);
    });
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