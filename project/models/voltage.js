var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName  = "voltages";
var tableAttributes = ["id", "level"];
//id is primary key
//level is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

exports.getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getByLevel = function (level, done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [tableAttributes[1]], ['=']), [level], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getByLevelWithCreation = function (level, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[1], level);
    var query = sql.toParam().text;
    query += " ON DUPLICATE KEY UPDATE level = level;";
    var getSql = squel.select()
        .from(tableName)
        .where(
        squel.expr()
            .and(tableAttributes[1] + " = ?", level)
    );
    query += getSql.toParam().text;
    var vals = sql.toParam().values.concat(getSql.toParam().values);
    //console.log(query + getSql.toParam().text);
    //console.log(sql.toParam().values.concat(getSql.toParam().values));
    tempConn.query(query, vals, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.create = function (levels, done) {
    if (!(levels.constructor === Array)) {
        levels = [[levels]];
    }
    var argNames = [tableAttributes[1]];
    var values = [levels];
    var createdSQL = SQLHelper.createSQLInsertString(tableName, argNames, values);
    //console.log("states insert query is " + JSON.stringify(createdSQL));
    db.get().query(createdSQL['SQLQueryString'], createdSQL['SQLQueryValues'], function (err, result) {
        if (err) return done(err);
        done(null, result.affectedRows);
    });
};