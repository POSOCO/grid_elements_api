var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Region = require('./region.js');
var tableName = "owners";
var tableAttributes = ["id", "name", "metadata", "regions_id"];
var squel = require("squel");
//id is primary key
//name is unique

var getAll = function (done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], [], []), function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

var getByName = function (name, done) {
    db.get().query(SQLHelper.createSQLGetString(tableName, ['*'], ['name'], ['=']), [name], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

var getByNameWithCreationWithoutTransaction = function (name, metadata, regionName, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        tempConn = db.get();
    }
    Region.getByNameWithCreation(regionName, function (err, rows) {
        if (err) return done(err);
        //console.log(JSON.stringify(rows));
        var regionId = rows[0].id;
        var sql = squel.insert()
            .into(tableName)
            .set(tableAttributes[1], name)
            .set(tableAttributes[2], metadata)
            .set(tableAttributes[3], regionId);
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
    }, tempConn);
};

var getByNameWithCreation = function (name, metadata, regionName, done, conn) {
    var tempConn = conn;
    if (conn == null) {
        db.getPoolConnection(function (err, poolConnection) {
            if (err) return done(err);
            tempConn = poolConnection;
            tempConn.beginTransaction(function (err) {
                //console.log("transaction started...");
                if (err) {
                    return done(err);
                }
                getByNameWithCreationWithoutTransaction(name, metadata, regionName, function (err, rows) {
                    if (err) {
                        //console.log("error in owner name creation...");
                        tempConn.rollback(function () {
                            //console.log("transaction rollback done ...");
                            return done(err);
                        });
                        return;
                    }
                    tempConn.commit(function (err) {
                        if (err) {
                            //console.log("error in transaction commit ...");
                            tempConn.rollback(function () {
                                //console.log("error in transaction commit rollback ...");
                                return done(err);
                            });
                        }
                        //console.log("transaction committed successfully ...");
                        done(null, rows);
                    });
                }, tempConn);
            });
        });
    } else {
        getByNameWithCreationWithoutTransaction(name, metadata, regionName, function (err, rows) {
            if (err) return done(err);
            done(null, rows);
        }, tempConn);
    }
};

var forceCreate = function (name, metadata, regionName, done) {
    //force creation can be done by http://stackoverflow.com/questions/1361340/how-to-insert-if-not-exists-in-mysql
    Region.replace(regionName, function (err, affectedRows) {
        Region.getByName(regionName, function (err, rows) {
            if (err) return done(err);
            if (!Array.isArray(rows) && rows[0].id == null && isNaN(rows[0].id) && rows[0].id <= 0) {
                //console.log("Region id not found even after replacement");
                return done(new Error("Region id not found even after replacement"));
            }
            var regionId = rows[0].id;
            var argNames = [tableAttributes[1], tableAttributes[2], tableAttributes[3]];
            var values = [name, metadata, regionId];
            var createdSQL = SQLHelper.createSQLReplaceString(tableName, argNames);
            //console.log("OWNERS replace query is " + createdSQL);
            db.get().query(createdSQL, values, function (err, result) {
                if (err) return done(err);
                done(null, result.affectedRows);
            });
        });
    });
};

var creationSQL = function (ownerNameSQLVar, ownerMetadataSQLVar, regionNameSQLVar, regionIdSQLVar, ownerIdSQLVar, replace) {
    var delimiter = ";";
    var sql = "";
    sql += NewSQLHelper.getSQLInsertIgnoreString(Region.tableName, [Region.tableColumnNames[1]], [regionNameSQLVar], Region.tableColumnNames[0], regionIdSQLVar);
    sql += delimiter;
    if (replace) {
        sql += NewSQLHelper.getSQLInsertReplaceString(tableName, [tableAttributes[1], tableAttributes[2], tableAttributes[3]], [ownerNameSQLVar, ownerMetadataSQLVar, regionIdSQLVar], tableAttributes[0], ownerIdSQLVar);
    } else {
        sql += NewSQLHelper.getSQLInsertIgnoreString(tableName, [tableAttributes[1], tableAttributes[2], tableAttributes[3]], [ownerNameSQLVar, ownerMetadataSQLVar, regionIdSQLVar], tableAttributes[0], ownerIdSQLVar, [tableAttributes[1]], [ownerNameSQLVar]);
    }
    //console.log(sql);
    return sql;
};

module.exports = {
    get: getAll,
    getByName: getByName,
    forceCreate: forceCreate,
    tableColumnNames: tableAttributes,
    tableName: tableName,
    creationSQL: creationSQL,
    getByNameWithCreation: getByNameWithCreation
};
