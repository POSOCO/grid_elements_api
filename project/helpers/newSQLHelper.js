var ArrayHelper = require('./arrayHelper.js');

var createSQLGetString = function (tableName, getArgNames, whereArgNames, whereArgOperators) {
    var SQLQueryString = 'SELECT ';
    SQLQueryString += getArgNames.join(',') + ' ';
    SQLQueryString += 'FROM ' + tableName;
    var whereArgExpressions = new Array(whereArgNames.length);
    if (whereArgNames.length > 0) {
        for (var i = 0; i < whereArgNames.length; i++) {
            whereArgExpressions[i] = whereArgNames[i] + whereArgOperators[i] + '?';
        }
        SQLQueryString += ' WHERE ' + whereArgExpressions.join(' AND ');
    }
    //console.log("SQLQUERYSTRING IS " + SQLQueryString);
    return SQLQueryString;
};

var createSQLReplaceString = function (tableName, setArgNames, idColumnName) {
    var SQLQueryString = 'INSERT INTO ' + tableName + ' (' + setArgNames.join(',') + ') VALUES';
    SQLQueryString += " (" + ArrayHelper.createArrayFromSingleElement('?', setArgNames.length).join(',') + ") ";
    var whereArgExpressions = new Array(setArgNames.length);
    if (setArgNames.length > 0) {
        for (var i = 0; i < setArgNames.length; i++) {
            whereArgExpressions[i] = setArgNames[i] + ' = VALUES(' + setArgNames[i] + ')';
        }
    }
    SQLQueryString += "ON DUPLICATE KEY UPDATE ";
    SQLQueryString += whereArgExpressions.join(',');
    SQLQueryString += ";";
    //console.log("SQLReplace STRING IS " + SQLQueryString);
    SQLQueryString += "SET @insertedId = (";
    SQLQueryString += createSQLGetString(tableName, idColumnName, setArgNames, ArrayHelper.createArrayFromSingleElement("=",setArgNames.length));
    SQLQueryString += ");";
    SQLQueryString += "SELECT @insertedId AS insertedId";
    return SQLQueryString;
};

var createSQLInsertIgnoreString = function (tableName, setArgNames, ignoreID) {
    var SQLQueryString = 'INSERT INTO ' + tableName + ' (' + setArgNames.join(',') + ') VALUES';
    SQLQueryString += " (" + ArrayHelper.createArrayFromSingleElement('?', setArgNames.length).join(',') + ") ";
    var whereArgExpressions = new Array(setArgNames.length);
    if (setArgNames.length > 0) {
        for (var i = 0; i < setArgNames.length; i++) {
            whereArgExpressions[i] = setArgNames[i] + ' = VALUES(' + setArgNames[i] + ')';
        }
    }
    SQLQueryString += "ON DUPLICATE KEY UPDATE " + ignoreID + "=" + ignoreID;
    SQLQueryString += ";";
    //console.log("SQLInsertIgnoreString STRING IS " + SQLQueryString);
    return SQLQueryString;
};

module.exports = {
    createSQLGetString: createSQLGetString,
    createSQLReplaceString: createSQLReplaceString,
    createSQLInsertIgnoreString: createSQLInsertIgnoreString
};