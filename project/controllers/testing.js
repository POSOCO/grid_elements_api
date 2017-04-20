var express = require('express');
var router = express.Router();
var Owner = require('../models/owner');
var Element = require('../models/element');
var Substation = require('../models/substation');

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
    Element.getWithCreation(name, "sudhir_desc", 9999, 9999, 9999, "ICT", "400", ["ACPL", "BALCO"], ["sudhir_metadata", "sudhir_metadata"], ["WR", "WR"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], [], [], function (err, rows) {
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

module.exports = router;
