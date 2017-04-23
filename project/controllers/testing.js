var express = require('express');
var router = express.Router();
var Owner = require('../models/owner');
var Element = require('../models/element');
var Substation = require('../models/substation');
var BusReactor = require('../models/bus_reactor');
var Line = require('../models/line');

router.get('/create_owner', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    var name = req.query.name;
    if (!name) {
        name = "ACPL";
    }
    Owner.getByNameWithCreation(name, "NA", "WR", function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'owner': rows});
    }, null);

});

router.get('/create_element', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    var name = req.query.name;
    if (!name) {
        name = "sudhir";
    }
    //name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn
    Element.getWithCreation(name, "sudhir_desc", 9999, 9999, 9999, "ICT", "400", 1, ["ACPL", "BALCO"], ["sudhir_metadata", "sudhir_metadata"], ["WR", "WR"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], ["sudhir", "sudhir1"], ["400", "400"], function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'element': rows[0]});
    }, null);
});

router.get('/create_substation', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    var name = req.query.name;
    if (!name) {
        name = "sudhir";
    }
    //name, description, sil, stabilityLimit, thermalLimit, typeName, voltage, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn
    Substation.getWithCreation(name, "sudhir_desc", "400", ["ACPL", "BALCO"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'substation': rows[0]});
    }, null);
});

router.get('/create_bus_reactor', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    var name = req.query.name;
    if (!name) {
        name = "sudhir";
    }
    //name, description, sil, stabilityLimit, thermalLimit, voltage, ownerNames, regions, states, substationNames, substationVoltages, mvar, done, conn
    BusReactor.getWithCreation(name, "sudhir_desc", 100, 200, 500, "400", 1, ["ACPL", "BALCO"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], ["sudhir"], ["400"],125, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'bus_reactor': rows[0]});
    }, null);
});

router.get('/create_line', function (req, res, next) {
    //console.log((typeof req.user == 'undefined') ? "undefined" : req.user.username);
    var name = req.query.name;
    if (!name) {
        name = "sudhir";
    }
    //name, description, sil, stabilityLimit, thermalLimit, voltage, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_num, line_len, no_load_mvar, done, conn
    Line.getWithCreation(name, "sudhir_desc", 111, 222, 555, "400",1, ["ACPL", "BALCO"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], ["sudhir", "Akola"], ["400", "400"], "Twin Moose", 999, 1345, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'line': rows[0]});
    }, null);
});

module.exports = router;
