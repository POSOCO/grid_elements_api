var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var tableName = "elements_has_owners";
var tableAttributes = ["elements_id", "owners_id"];
var squel = require("squel");
var vsprintf = require("sprintf-js").vsprintf;
//id is primary key
//name is unique

exports.getAll = function (done) {
    var sql = squel.select()
        .from(tableName);
    db.get().query(sql.toParam().text, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getByIds = function (element_id, owner_id, done) {
    var sql = squel.select()
        .from(tableName);
    var expr = squel.expr();
    if (element_id != null) {
        expr.and(tableAttributes[0] + " = ?", element_id);
    }
    if (owner_id != null) {
        expr.and(tableAttributes[1] + " = ?", owner_id);
    }
    sql.where(expr);
    db.get().query(sql.toParam().text, sql.toParam().values, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getWithCreation = function (element_id, owner_id, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    var sql = squel.insert()
        .into(tableName)
        .set(tableAttributes[0], element_id)
        .set(tableAttributes[1], owner_id);
    var query = sql.toParam().text;
    //query += " ON DUPLICATE KEY UPDATE elements_id = elements_id;";
    query += vsprintf(" ON DUPLICATE KEY UPDATE %s = %s;", [tableAttributes[0], tableAttributes[0]]);
    var getSql = squel.select()
        .from(tableName)
        .where(
        squel.expr()
            .and(tableAttributes[0] + " = ?", element_id)
            .and(tableAttributes[1] + " = ?", owner_id)
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
    //todo complete this
};