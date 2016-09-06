var express = require('express');
var router = express.Router();
var State = require('../models/state.js');

router.get('/', function (req, res, next) {
    State.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'states': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    State.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'state': rows});
    });
});

router.post('/', function (req, res, next) {
    var names = req.body["name"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("States name is " + names);
    State.create(names, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numStatesInserted': numberOfRowsInserted});
    });
});

module.exports = router;