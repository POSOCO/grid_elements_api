var express = require('express');
var router = express.Router();
var Owner = require('../models/owner');

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

module.exports = router;
