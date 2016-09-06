var express = require('express');
var router = express.Router();
var ConductorType = require('../models/conductor_type.js');

router.get('/', function (req, res, next) {
    ConductorType.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'types': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    ConductorType.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'con_type': rows});
    });
});

router.post('/', function (req, res, next) {
    var types = req.body["type"];
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + types);
    ConductorType.create(types, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numTypesInserted': numberOfRowsInserted});
    });
});

module.exports = router;
