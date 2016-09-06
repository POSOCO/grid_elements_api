var express = require('express');
var router = express.Router();
var OptionalCode = require('../models/optional_code.js');

router.post('/', function (req, res) {
    var code_ids = req.body["values[code_ids][]"];
    var rldc_ids = req.body["values[rldc_ids][]"];
    var codes = req.body["values[codes][]"];
    //TODO do the data validation of values array
    //console.log("Optional Code create post request body object is " + JSON.stringify(req.body));
    OptionalCode.create(code_ids, rldc_ids, codes, function (err, numberOfRowsInserted) {
        if (err) {
            res.json({'Error': err});
        }
        res.json({'numOtherCodes': numberOfRowsInserted});
    });
});
module.exports = router;