var express = require('express');
var router = express.Router();
var Element = require('../models/element.js');
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
    var volt = req.query.voltage;
    var name_str = req.query.name;

    var rows_offset = 0;

    if (typeof name_str != 'undefined' && name_str.trim() != "") {
        whereCols.push('elems_table.ss_names');
        whereOperators.push('LIKE');
        whereValues.push("%" + name_str + "%");
        whereCols.push('elems_table.name');
        whereOperators.push('LIKE');
        whereValues.push("%" + name_str + "%");
    }
    if (typeof owner != 'undefined' && owner.trim() != "") {
        whereCols.push('elems_table.owner_names');
        whereOperators.push('LIKE');
        whereValues.push("%" + owner + "%");
        whereCols.push('elems_table.ss_owner_names');
        whereOperators.push('LIKE');
        whereValues.push("%" + owner + "%");
    }
    if (typeof region != 'undefined' && region.trim() != "") {
        whereCols.push('elems_table.region_names');
        whereOperators.push('LIKE');
        whereValues.push("%" + region + "%");
        whereCols.push('elems_table.ss_region_names');
        whereOperators.push('LIKE');
        whereValues.push("%" + region + "%");
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
    if (typeof limit_rows == 'undefined' || isNaN(limit_rows) || limit_rows < 0) {
        limit_rows = 50;
    }
    if (typeof rows_page != 'undefined' && rows_page != null && rows_page > 0) {
        rows_offset = limit_rows * rows_page;
    }
    Element.getAll(whereCols, whereOperators, whereValues, limit_rows, rows_offset, null, null, function (err, rows) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json({'data': rows});
    }, null);
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));

});

router.post('/create_array', function (req, res, next) {
    var elements = req.body["elements"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var elementIterators = Array.apply(null, {length: elements.length}).map(Function.call, Number);
    var getElementId = function (elementIterator, callback) {
        //name, description, voltage, ownerNames, regions, states
        var ownerRegions = Array.apply(null, {length: elements[elementIterator]["ownerName"].split("/").length}).map(function (obj) {
            return "NA";
        });
        //function (name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn)
        Element.getWithCreation(elements[elementIterator]["name"], elements[elementIterator]["description"], elements[elementIterator]["sil"], elements[elementIterator]["stability_limit"], elements[elementIterator]["thermal_limit"], elements[elementIterator]["type"], elements[elementIterator]["voltage"], elements[elementIterator]["elem_num"], elements[elementIterator]["ownerName"].split("/"), elements[elementIterator]["ownerName"].split("/"), ownerRegions, elements[elementIterator]["region"].split("/"), elements[elementIterator]["state"].split("/"), elements[elementIterator]["substations"], elements[elementIterator]["substationVoltages"], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elementId = rows[0].id;
            //console.log(elementId);
            callback(null, elementId);
        }, null)
    };
    //finding each element Id
    async.mapSeries(elementIterators, getElementId, function (err, results) {
        if (err) return next(err);
        var elementIds = results;
        res.json({elementIds: elementIds});
    });
});

module.exports = router;
