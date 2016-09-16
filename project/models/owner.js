var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Region = require('./region.js');
var tableName = "owners";
var tableAttributes = ["id", "name", "metadata", "regions_id"];
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
    sql += NewSQLHelper.setVariableSQLString(regionNameSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(regionIdSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(ownerNameSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.setVariableSQLString(ownerMetadataSQLVar, "?");
    sql += delimiter;
    sql += NewSQLHelper.createSQLInsertIgnoreStatementString(Region.tableName, [Region.tableColumnNames[1]], [regionNameSQLVar], Region.tableColumnNames[0], regionIdSQLVar);
    sql += delimiter;
    if (replace) {
        sql += NewSQLHelper.createSQLReplaceStatementString(tableName, [tableAttributes[1], tableAttributes[2], tableAttributes[3]], [ownerNameSQLVar, ownerMetadataSQLVar, regionIdSQLVar], tableAttributes[0], ownerIdSQLVar);
    } else {
        sql += NewSQLHelper.createSQLInsertIgnoreStatementString(tableName, [tableAttributes[1], tableAttributes[2], tableAttributes[3]], [ownerNameSQLVar, ownerMetadataSQLVar, regionIdSQLVar], tableAttributes[0], ownerIdSQLVar, [tableAttributes[1]], [ownerNameSQLVar]);
    }
    console.log(sql);
    return sql;
};

module.exports = {
    get: getAll,
    getByName: getByName,
    forceCreate: forceCreate,
    tableColumnNames: tableAttributes,
    tableName: tableName,
    creationSQL: creationSQL
};
