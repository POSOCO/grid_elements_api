var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');

var get = function (code_id, done) {
    db.get().query(SQLHelper.createSQLGetString('times', ['id', 'code_id', 'time'], ['code_id'], ['=']), [code_id], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

var getById = function (id, done) {
    db.get().query(SQLHelper.createSQLGetString('times', ['id', 'code_id', 'time'], ['id'], ['=']), [id], function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

var update = function (code_id, time, done) {
    var sql = "START TRANSACTION READ WRITE;DELETE FROM times WHERE code_id = ?;INSERT INTO times (code_id, time) VALUES (?, ?);COMMIT;SELECT LAST_INSERT_ID() AS new_code;";
    db.get().query(sql, [code_id, code_id, time], function (err, result) {
        console.log("updated code db time id---" + JSON.stringify(result));
        if (err) return done(err);
        done(null, result[0][0]['newcode']);
    });
};

module.exports = {
    get: get,
    getById: getById,
    update: update
};