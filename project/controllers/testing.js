var express = require('express');
var router = express.Router();
var Owner = require('../models/owner');
var Element = require('../models/element');

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
    Element.getWithCreation(name, "sudhir_desc", 9999, 9999, 9999, "ICT", "400", ["ACPL", "BALCO"], ["WR", "WR"], ["sudhir_metadata", "sudhir_metadata"], ["WR", "SR"], ["Andhra Pradesh", "Bihar"], [], [], function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'element': rows});
    }, null);
});

module.exports = router;
