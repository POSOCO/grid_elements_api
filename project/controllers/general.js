var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/home', function (req, res) {
    //just for testing
    /*
     require('../models/element').create("SUDHIR_EL", "SUDHIR_EL_DES", 9913, 1399, 1399, "Line", "1200", ["SUDHIR_OWNER", "SUDHIR_OWNER_1"], ["NO METADATA", "NO METADATA"], ["NA", "NA"], ["NR", "ER"], ["Bihar", "Assam"], function (err, rows) {
     if (err) {
     console.log(err);
     }
     console.log("element insertion query completed");
     });
     */
    require('../models/substation').create("SUDHIR_SUBSTATION", "NO DESCRIPTION", "400", ["SUDHIROWNER", "SUDHIR_OWNER_1"], ["SR", "NER"], ["Andhra Pradesh", "Goa"], true, function (err, rows) {
        if (err) {
            console.log(err);
        }
        console.log("substation insertion query completed");
    });
    /*
     require('../models/element').elementSubstationCreate(["ACBIL", "ACBIL"], ["400", "400"], [1840, 1832], function (err, rows) {
     if (err) {
     console.log(err);
     }
     console.log(JSON.stringify(rows));
     });
     */
    res.render('home', {user: req.user});
});

module.exports = router;