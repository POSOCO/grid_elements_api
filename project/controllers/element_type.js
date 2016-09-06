var express = require('express');
var router = express.Router();
var Element_type = require('../models/element_type.js');

router.get('/', function (req, res, next) {
    Element_type.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'types': rows});
    });
});

router.get('/get_by_type', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Element_type.getByType(req.query.type, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'el_type': rows});
    });
});

router.post('/', function (req, res, next) {
    var types = req.body["type"];
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + types);
    Element_type.create(types, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numTypesInserted': numberOfRowsInserted});
    });
});

module.exports = router;