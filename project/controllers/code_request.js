var express = require('express');
var router = express.Router();
var CodeRequest = require('../models/code_request.js');

router.post('/', function (req, res) {
    var entity_ids = req.body["values[entity_ids][]"];
    var code_ids = req.body["values[code_ids][]"];
    //TODO do the data validation of values array
    //console.log("Requested Entities create post request body object is " + JSON.stringify(req.body));
    CodeRequest.create(entity_ids, code_ids, function (err, numberOfRowsInserted) {
        if (err) {
            res.json({'Error': err});
        }
        res.json({'numRequesting': numberOfRowsInserted});
    });
});
module.exports = router;