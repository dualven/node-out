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
        console.log('so result:' + result[0]['db-ip'])
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
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'dbinfo';
    //get data 
    console.log('dbinfo post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    //test db
    var f = function (result) {
//        console.log(JSON.stringify(result));
//        console.log('so result:' + result[0]['db-ip'])
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.checkCon(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    //right : 1 store db , 2 back
    //wrong : back wrong info
//    res.send('dbinfo respond with a resource');
});
router.all('/gettables', function (req, res, next) {
    console.log('gettables post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    var f = function (result) {
        res.json(result);
    }
    var a = require('../public/js/mysqlout.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, req.body.tb, req.body.co);
    g.getTables(f);
});
router.all('/getcolumns', function (req, res, next) {
    console.log('gettables post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    var f = function (result) {
        res.json(result);
    }
    var a = require('../public/js/mysqlout.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, req.body.tb, req.body.co);
    g.getColumns(req.body.tb, f);
});
router.all('/getdbs', function (req, res, next) {
    console.log('gettables post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    var f = function (result) {
        res.json(result);
    }
    var a = require('../public/js/mysqlout.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, " "," ");
    g.getDbs( f);
});
router.all('/output', function (req, res, next) {
    console.log('output post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    console.log('output post output : ' + req.body.start + "---" + req.body.end);
     console.log('output post output : ' + req.body.tb + "---" + req.body.co);
    var a = require('../public/js/mysqlout.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, req.body.tb, req.body.co);
    g.setDate(req.body.end);
    g.Out();
});
module.exports = router;
