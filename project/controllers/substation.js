var express = require('express');
var router = express.Router();
var Substation = require('../models/substation.js');

router.get('/', function (req, res, next) {
    Substation.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'substations': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));

});

router.post('/', function (req, res, next) {
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + types);

});

module.exports = router;
