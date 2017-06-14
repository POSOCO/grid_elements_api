var express = require('express');
var router = express.Router();
var Line = require('../models/line.js');
var async = require("async");

router.get('/', function (req, res, next) {
    var whereCols = [];
    var whereOperators = [];
    var whereValues = [];
    var limit_rows = req.query.limit_rows;
    var rows_page = req.query.offset_page;
    var type = req.query.type;
    var owner = req.query.owner;
    var region = req.query.region;
    var stateStr = req.query.stateStr;
    var volt = req.query.voltage;
    var name_str = req.query.name;
    var line_length = req.query.line_length;
    var no_load_mvar = req.query.no_load_mvar;
    var conductor_type = req.query.conductor_type;

    var rows_offset = 0;

    if (typeof name_str != 'undefined' && name_str.trim() != "") {
        whereCols.push('elems_table.ss_names_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + name_str + "%");
        whereCols.push('elems_table.name');
        whereOperators.push('LIKE');
        whereValues.push("%" + name_str + "%");
    }
    if (typeof owner != 'undefined' && owner.trim() != "") {
        whereCols.push('elems_table.el_owners_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + owner + "%");
        whereCols.push('elems_table.ss_owners_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + owner + "%");
    }
    if (typeof region != 'undefined' && region.trim() != "") {
        whereCols.push('elems_table.el_regions_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + region + "%");
        whereCols.push('elems_table.ss_regions_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + region + "%");
    }
    if (typeof stateStr != 'undefined' && stateStr.trim() != "") {
        whereCols.push('elems_table.el_states_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + stateStr + "%");
        whereCols.push('elems_table.ss_states_list');
        whereOperators.push('LIKE');
        whereValues.push("%" + stateStr + "%");
    }
    if (typeof volt != 'undefined' && volt.trim() != "") {
        whereCols.push('elems_table.level');
        whereOperators.push('=');
        whereValues.push(volt);
    }
    if (typeof type != 'undefined' && type.trim() != "") {
        whereCols.push('elems_table.type');
        whereOperators.push('=');
        whereValues.push(type);
    }
    if (typeof line_length != 'undefined' && line_length.trim() != "") {
        whereCols.push("`lines`.line_length");
        whereOperators.push('=');
        whereValues.push(line_length);
    }
    if (typeof no_load_mvar != 'undefined' && no_load_mvar.trim() != "") {
        whereCols.push("`lines`.noloadmvar");
        whereOperators.push('=');
        whereValues.push(no_load_mvar);
    }
    if (typeof conductor_type != 'undefined' && conductor_type.trim() != "") {
        whereCols.push("conductor_types.name");
        whereOperators.push('=');
        whereValues.push(conductor_type);
    }
    if (typeof limit_rows == 'undefined' || isNaN(limit_rows) || limit_rows < 0) {
        limit_rows = 50;
    }
    if (typeof rows_page != 'undefined' && rows_page != null && rows_page > 0) {
        rows_offset = limit_rows * rows_page;
    }
    Line.getAll(whereCols, whereOperators, whereValues, limit_rows, rows_offset, null, null, function (err, rows) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json({'data': rows});
    }, null);
});

router.post('/create_from_csv', function (req, res, next) {
    //var name = req.body["name"];
    var voltage = req.body["voltage"];
    var conductor_type = req.body["conductor_type"];
    var sil = req.body["sil"];
    var line_number = req.body["line_number"];
    var line_length = req.body["line_length"];
    var no_load_mvar = req.body["no_load_mvar"];
    var owner_names = req.body["owner_names[]"];
    var regions = req.body["regions"];
    var states = req.body["states"];
    var substation_names = req.body["substation_names[]"];
    var substation_voltages = req.body["substation_voltages[]"];
    substation_names.sort();
    var name = substation_names.join(" - ");
    if (!Array.isArray(owner_names)) {
        owner_names = [owner_names];
    }
    sil = getDefaultIfNotDesired(sil, 0, true);
    line_number = getDefaultIfNotDesired(line_number, 0, true);
    line_length = getDefaultIfNotDesired(line_length, 0, true);
    no_load_mvar = getDefaultIfNotDesired(no_load_mvar, 0, true);
    owner_names = getDefaultIfNotDesired(owner_names, []);
    regions = getDefaultIfNotDesired(regions, []);
    states = getDefaultIfNotDesired(states, []);

    //console.log(JSON.stringify(req.body));
    //res.json({message: "Please wait"});

    Line.create(name, "No Descrripton", voltage, conductor_type, sil, line_number, line_length, no_load_mvar, owner_names, regions, states, substation_names, substation_voltages, true, function (err, rows) {
        if (err) {
            return next(err);
        }
        //console.log("ROWS BY SUBSTATION INSERT ARE \n" + rows);
        var resultObject = rows[rows.length - 1][0];
        console.log("RESULT FROM LINE CREATION IS => " + JSON.stringify(resultObject));
        res.json(resultObject);
    });
});

function getDefaultIfNotDesired(x, desired, convert_to_number) {
    if (x == null || x == undefined) {
        return desired;
    }
    else if (!Array.isArray(x) && (isNaN(x) || isNaN(parseInt(x))) && x.trim() == "") {
        return desired;
    }
    if (convert_to_number) {
        if (!Array.isArray(x)) {
            if (isNaN(x)) {
                return 0;
            } else {
                return parseInt(x);
            }
        }
    }
    return x;
}

router.post('/create_array', function (req, res, next) {
    var lines = req.body["lines"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var lineIterators = Array.apply(null, {length: lines.length}).map(Function.call, Number);
    var getLineId = function (lineIterator, callback) {
        //function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, done, conn) {
        Line.getWithCreation(lines[lineIterator]["name"], lines[lineIterator]["description"], lines[lineIterator]["sil"], lines[lineIterator]["stability_limit"], lines[lineIterator]["thermal_limit"], lines[lineIterator]["voltage"], lines[lineIterator]["elem_num"], lines[lineIterator]["ownerName"].split('/'), lines[lineIterator]["region"].split('/'), lines[lineIterator]["state"].split('/'), lines[lineIterator]["substation_names"], lines[lineIterator]["substation_voltages"], lines[lineIterator]["cond_type"], lines[lineIterator]["line_len"], lines[lineIterator]["no_load_mvar"], function (err, rows) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            var lineId = rows[0].id;
            //console.log(lineId);
            callback(null, lineId);
        }, null)
    };
    //finding each substation Id
    async.mapSeries(lineIterators, getLineId, function (err, results) {
        if (err) return next(err);
        var lineIds = results;
        res.json({lineIds: lineIds});
    });
});

module.exports = router;
