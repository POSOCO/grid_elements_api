var ArrayHelper = require('./arrayHelper.js');

/*
 SELECT column_name,column_name,column_name
 FROM table_name
 WHERE column_name operator value AND column_name1 operator1 value1 AND column_name2 operator2 value2;
 */
/**
 *
 * @param tableName
 * @param getArgNames
 * @param whereArgColNames
 * @param whereArgOperators
 * @param inputVars
 * @returns {string}
 */
var createSQLGetStatementString = function (tableName, getArgNames, whereArgColNames, whereArgOperators, inputVars) {
    var space = ' ';
    var SQLQueryString = 'SELECT' + space;
    SQLQueryString += getArgNames.join(',') + space;
    SQLQueryString += 'FROM' + space + tableName + space;
    ///TODO check also if whereArgOperators, inputVars are Arrays or not and check if the lengths of the Arrays whereArgColNames, whereArgOperators, inputVars are equal or not
    if (Array.isArray(whereArgColNames) && whereArgColNames.length > 0) {
        var whereArgExpressions = new Array(whereArgColNames.length);
        for (var i = 0; i < whereArgColNames.length; i++) {
            whereArgExpressions[i] = whereArgColNames[i] + space + whereArgOperators[i] + space + inputVars[i];
        }
        SQLQueryString += 'WHERE' + space + whereArgExpressions.join(space + 'AND' + space);
    }
    //console.log("SQL_QUERY_STATEMENT_STRING IS " + SQLQueryString);
    return SQLQueryString;
};

/*
 INSERT INTO table_name (column1,column2,column3)
 VALUES (value1,value2,value3) ON DUPLICATE KEY UPDATE column1=VALUES(column1),column2=VALUES(column2),column3=VALUES(column3);

 SELECT idColumnName
 FROM table_name
 WHERE column1 operator value1 AND column2 operator2 value2 AND column3 operator3 value3;
 */
/**
 *
 * @param tableName
 * @param setArgNames
 * @param inputVars
 * @param idColumnName
 * @param outputVarName
 * @returns {string}
 */
var createSQLReplaceStatementString = function (tableName, setArgNames, inputVars, idColumnName, outputVarName) {
    var space = ' ';
    var delimiter = ';';
    var SQLQueryString = 'INSERT INTO' + space + tableName + space + '(' + setArgNames.join(',') + ')' + space + 'VALUES' + space;
    SQLQueryString += '(' + inputVars.join(',') + ')' + space;
    var updateExpressions = new Array(setArgNames.length);
    SQLQueryString += "ON DUPLICATE KEY UPDATE" + space;
    if (setArgNames.length > 0) {
        for (var i = 0; i < setArgNames.length; i++) {
            updateExpressions[i] = setArgNames[i] + '=VALUES(' + setArgNames[i] + ')';
        }
    }
    SQLQueryString += updateExpressions.join(',');
    if (idColumnName != null && idColumnName.trim() != '' && outputVarName != null && outputVarName.trim() != '' && outputVarName[0] == '@') {
        SQLQueryString += delimiter;
        //console.log("SQLReplaceStatement STRING IS " + SQLQueryString);
        SQLQueryString += "SET" + space + outputVarName + space + "= (";
        SQLQueryString += createSQLGetStatementString(tableName, [idColumnName], setArgNames, ArrayHelper.createArrayFromSingleElement("=", setArgNames.length), inputVars);
        SQLQueryString += ")";
    }
    return SQLQueryString;
};

/*
 INSERT INTO table_name (column1,column2,column3)
 VALUES (value1,value2,value3) ON DUPLICATE KEY UPDATE column1=column1,column2=column2,column3=column3;

 SELECT idColumnName
 FROM table_name
 WHERE column1 operator value1 AND column2 operator2 value2 AND column3 operator3 value3;
 */
/**
 *
 * @param tableName
 * @param setArgNames
 * @param inputVars
 * @param idColumnName
 * @param outputVarName
 * @returns {string}
 */
var createSQLInsertIgnoreStatementString = function (tableName, setArgNames, inputVars, idColumnName, outputVarName, idFetchArgNames, idFetchArgVars) {
    var space = ' ';
    var delimiter = ';';
    var SQLQueryString = "";
    SQLQueryString += 'INSERT INTO' + space + tableName + space + '(' + setArgNames.join(',') + ')' + space + 'VALUES' + space;
    SQLQueryString += '(' + inputVars.join(',') + ')' + space;
    var updateExpressions = new Array(setArgNames.length);
    SQLQueryString += "ON DUPLICATE KEY UPDATE" + space;
    if (setArgNames.length > 0) {
        for (var i = 0; i < setArgNames.length; i++) {
            updateExpressions[i] = setArgNames[i] + '=' + setArgNames[i];
        }
    }
    SQLQueryString += updateExpressions.join(',');
    if (idFetchArgNames == null) {
        idFetchArgNames = setArgNames;
        idFetchArgVars = inputVars;
    }
    if (idColumnName != null && idColumnName.trim() != '' && outputVarName != null && outputVarName.trim() != '' && outputVarName[0] == '@') {
        SQLQueryString += delimiter;
        //console.log("SQLReplaceStatement STRING IS " + SQLQueryString);
        SQLQueryString += "SET" + space + outputVarName + space + "= (";
        SQLQueryString += createSQLGetStatementString(tableName, [idColumnName], idFetchArgNames, ArrayHelper.createArrayFromSingleElement("=", idFetchArgNames.length), idFetchArgVars);
        SQLQueryString += ")";
    }
    return SQLQueryString;
};

var setVariableSQLString = function (nameSQLVar, varValue) {
    var str = "SET " + nameSQLVar + " = " + varValue;
    return str;
};

module.exports = {
    createSQLGetStatementString: createSQLGetStatementString,
    createSQLReplaceStatementString: createSQLReplaceStatementString,
    createSQLInsertIgnoreStatementString: createSQLInsertIgnoreStatementString,
    setVariableSQLString: setVariableSQLString
};