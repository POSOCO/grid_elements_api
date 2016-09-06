var express = require('express');
var router = express.Router();
var DateHelper = require('../helpers/date.js');
var CodeTime = require('../models/code_time.js');

router.get('/', function (req, res) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    CodeTime.get(req.query.code_id, function (err, rows) {
        if (err) {
            res.json({'Error': err});
        }
        res.json({'code_time': rows});
    });
});

router.get('/get_by_id', function (req, res) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    CodeTime.getById(req.query.id, function (err, rows) {
        if (err) {
            res.json({'Error': err});
        }
        res.json({'code_time': rows});
    });
});

router.post('/', function (req, res) {
    var code_id = req.body["code_id"];
    var time = req.body["time"];
    //console.log("Code create post request body object is " + JSON.stringify(req.body));
    CodeTime.update(code_id, time, function (err, new_code) {
        if (err) {
            res.json({'Error': err});
        }
        //check if updation done correctly
        CodeTime.getById(result[0][0]['newcode'], function (err, rows) {
            if (DateHelper.getDateTimeString(new Date(rows[0]['time'])) == time) {
                res.json({'updated_code': new_code});
            }
            else {
                res.json({'Error': "Incorrect insertion, Please try Again"});
            }
        });
    });
});

module.exports = router;