var db = require('../db.js');
var SQLHelper = require('../helpers/sqlHelper');
var NewSQLHelper = require('../helpers/newSQLHelper');
var Element = require('./element');

var tableName = "line_reactors";
var tableAttributes = ["id", "elements_id", "lines_id", "mvar", "is_switchable"];
var squel = require("squel");
var async = require("async");
var vsprintf = require("sprintf-js").vsprintf;
//id is primary key
//(elements_id, number) is unique

exports.tableColumnNames = tableAttributes;
exports.tableName = tableName;
