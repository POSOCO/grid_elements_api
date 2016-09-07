var express = require('express');
var router = express.Router();
var Owner = require('../models/owner.js');

router.get('/', function (req, res, next) {
    Owner.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'owners': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Owner.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'region': rows});
    });
});

router.post('/force_create', function (req, res, next) {
    var name = req.body["name"];
    var metadata = req.body["metadata"];
    var regionName = req.body["region_name"];
    console.log("OWNERS force create POST request body object is " + JSON.stringify(req.body));
    Owner.forceCreate(name, metadata, regionName, function (err, affectedRows) {
        if (err) {
            return next(err);
        }
        res.json({'affectedRows': affectedRows});
    });
});

module.exports = router;