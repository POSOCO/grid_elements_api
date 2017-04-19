var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName = "regions";
var tableAttributes = ["id", "name"];
var squel = require("squel");

//id is primary key
//name is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

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
    //console.log(query);
    //console.log(vals);
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
    //console.log("regions insert query is " + JSON.stringify(createdSQL));
    db.get().query(createdSQL['SQLQueryString'], createdSQL['SQLQueryValues'], function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    });
};

exports.replace = function (name, done) {
    db.get().query(SQLHelper.getSQLInsertIgnoreString(tableName, ["name"], ["name"]), [name], function (err, result) {
        if (err) return done(err);
        //console.log("RESULT FROM REGION REPLACE IS " + JSON.stringify(result));
        done(null, result.affectedRows);
    });
};