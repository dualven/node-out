var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('login222 respond with a resource');
});
router.get('/db', function (req, res, next) {
    var myDate = new Date();
    //read origin data from db , to init the web view 
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'dbinfo';
    var f = function (result) {
        console.log(JSON.stringify(result));
        console.log('so result:'+ result[0]['db-ip'])
        res.render('index/db', {
            result: result
        });
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.executeSelect();
//  var m = require('../public/js/mgdb_1.js');
//    m(f, DB_CONN_STR, doc);
});
router.all('/dbinfo', function (req, res, next) {
    //get data 
    console.log('dbinfo post data : ' + req.body.user + "---" + req.body.pwd + "---"+ req.body.ip + "---" + req.body.port);
    //test db
    
    //right : 1 store db , 2 back
    //wrong : back wrong info
    res.send('dbinfo respond with a resource');
});
module.exports = router;
