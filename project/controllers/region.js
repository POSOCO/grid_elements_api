var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');

router.get('/', function (req, res, next) {
    Region.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'regions': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Region.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'region': rows});
    });
});

router.post('/', function (req, res, next) {
    var names = req.body["name"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("States name is " + names);
    Region.create(names, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numRegionsInserted': numberOfRowsInserted});
    });
});

module.exports = router;