var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName = "element_types";
var tableAttributes = ["id", "type"];
//id is primary key
//type is unique
var squel = require("squel");
exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;

exports.getAll = function (done) {
    db.get().query(squel.select().from(tableName).toString(), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getByType = function (type, done) {
    db.get().query(squel.select().from(tableName).where(tableAttributes[1] + " = ?", type).toString(), [type], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getByTypeWithCreation = function (type, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[1], type);
    var query = sql.toParam().text;
    query += " ON DUPLICATE KEY UPDATE type = type;";
    var getSql = squel.select()
        .from(tableName)
        .where(
        squel.expr()
            .and(tableAttributes[1] + " = ?", type)
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