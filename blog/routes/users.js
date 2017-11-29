var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.all('/suggest', function (req, res, next) {
    console.log('suggest post data : ');
    console.log(req.param('query'));
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'dbinfo';
    var query = {"db-ip": new RegExp("^.*" + req.param('query') + ".*$")};
    console.log('query is :' + query);
    var f = function (result) {
        console.log(JSON.stringify(result));
//        console.log('so result:' + result[0]['db-ip'])
        res.json({
            result: result
        });
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
// res.json({"result":[["127","dxw"],["28","dxw2"]]});
});
router.all('/edittable', function (req, res, next) {
    console.log('edittable post data : ');
    console.log(req.param('value'));
    res.json({"result": req.param('value')});
});

router.all('/saveOpers', function (req, res, next) {
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'operslog';
    console.log('dbinfo post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    //test db
    var f = function (result) {
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    var where = {"dbinfo": "gwifi-think_user_access-login_time", "oper_time": new Date().format('yyyyMMddhhmmss'), "start": new Date().format('yyyyMMddhhmmss'), "end": new Date().format('yyyyMMdd'), "note": "error or ", "code": "pass or nopass"};
    n.saveOpers(where);
});

router.get('/process', function (req, res, next) {
    console.log('process post data : ');
//    console.log(req.params);
//    console.log(req.query.draw);
    var MongoClient = require('mongodb').MongoClient;
    var MongoDataTable = require('../lib/MongoDataTable');
    var options = req.query;
    options.caseInsensitiveSearch = true;
    options.showAlertOnError = true;
//    console.log('in users: ',options.columns);

    MongoClient.connect('mongodb://localhost:27017/dualven', function (err, db) {
        if (err) {
            console.error(err);
        }

        new MongoDataTable(db).get('operslog', options, function (err, result) {
            if (err) {
                console.error(err);
            }
            res.json(result);
        });
    });
});
router.get('/onemonth', function (req, res, next) {
    //return , all, online-all, online-today, offline-today
    var result={};
    result.total = 10;
    result.add = 5;
    result.sub = 4;
    result.compare = "0.5%";
    res.render('index/onemonth',{result:result});
});
router.get('/onlinehots_old', function (req, res, next) {
    var config = require('../model');
    var Sequelize = require('sequelize');
    var db = {
        sequelize: new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize)
    };

    db.Seq = db.sequelize.import('../model/seqtest.js');// get db conect
    var Promise = require('bluebird');
    var Builder = require('../lib/builder.js');
    Promise.promisifyAll(db.Seq.findAndCountAll);

    var builder = new Builder(db.Seq, req.query);
    builder.getParams().where = {
        $and:
                [{$and:
                                [{name: 'dxw'},
                                    {age: {gte: 11}},
                                ]},
                    Sequelize.where(Sequelize.fn('unix_timestamp', Sequelize.fn('DATE_ADD', Sequelize.col('createdAt'), Sequelize.literal('INTERVAL 300 SECOND'))), "<", Sequelize.fn('unix_timestamp', Sequelize.fn('now')))]
    };
    var con = builder.getParams(); 
    console.log(con);
    builder.fetchResults().then(function () {
        var response = builder.getResponse();
        console.log('now I get *******', response);
        res.json(response);
    });

});
router.get('/onlinehots', function (req, res, next) {
    var add = require('../model/offaddress.js');
    var Sequelize = require('sequelize');
    var db = {
        sequelize: new Sequelize(add.sequelize.database, add.sequelize.username, add.sequelize.password, add.sequelize)
    };

    db.Seq = db.sequelize.import('../model/onlinehots.js');// get db conect
    db.customer = db.sequelize.import('../model/customer.js');// get db conect
    db.Seq.hasOne(db.customer, {foreignKey: 'id'});
    var Promise = require('bluebird');
    var Builder = require('../lib/builder.js');
    Promise.promisifyAll(db.Seq.findAndCountAll);
    var builder = new Builder(db.Seq, req.query);
    var con = builder.getParams();
    con.include = [{model: db.customer, attributes: ['customer_name'], required: true},
//        { attributes: ['gw_id']}  
    ];
    if(con.where == null){
        con.where = {};
    }
   Object.assign( con.where ,
           {$and: [Sequelize.where(
                            Sequelize.fn('unix_timestamp', Sequelize.fn('DATE_SUB', Sequelize.fn('now'), Sequelize.literal('INTERVAL 60*60*24*30 SECOND'))),
                            "<",Sequelize.fn('unix_timestamp', Sequelize.col('online.created_at'))),
                    Sequelize.where(
                            Sequelize.fn('unix_timestamp', Sequelize.fn('DATE_SUB', Sequelize.fn('now'), Sequelize.literal('INTERVAL 300 SECOND'))),
                            "<", Sequelize.col('last_heartbeat_at'))
                ]}
            );

    console.log(con);
    builder.fetchResults().then(function () {
        var response = builder.getResponse();
        res.json(response);
    });
});
router.get('/offlinehots', function (req, res, next) {
    var add = require('../model/offaddress.js');
    ;
    var Sequelize = require('sequelize');
    var db = {
        sequelize: new Sequelize(add.sequelize.database, add.sequelize.username, add.sequelize.password, add.sequelize)
    };

    db.Seq = db.sequelize.import('../model/offlinehots.js');// get db conect
    db.customer = db.sequelize.import('../model/customer.js');// get db conect
    db.Seq.hasOne(db.customer, {foreignKey: 'id'});
    var Promise = require('bluebird');
    var Builder = require('../lib/builder.js');
    Promise.promisifyAll(db.Seq.findAndCountAll);

    var builder = new Builder(db.Seq, req.query);
    var con = builder.getParams();
    con.include = [{model: db.customer, attributes: ['customer_name'], required: true}];
     if(con.where == null){
        con.where = {};
    }
   Object.assign( 
           con.where,
            {$and: [Sequelize.where(
                            Sequelize.fn('unix_timestamp', Sequelize.fn('DATE_SUB', Sequelize.fn('now'), Sequelize.literal('INTERVAL 60*60*24*30 SECOND'))),
                            "<", Sequelize.col('last_heartbeat_at')),
                    Sequelize.where(
                            Sequelize.fn('unix_timestamp', Sequelize.fn('DATE_SUB', Sequelize.fn('now'), Sequelize.literal('INTERVAL 300 SECOND'))),
                            ">", Sequelize.col('last_heartbeat_at'))
                ]}
            );

    console.log(con);
    builder.fetchResults().then(function () {
        var response = builder.getResponse();
//        console.log('now I get *******', response);
        res.json(response);
    });
});
router.get('/codemng', function (req, res, next) {
     console.log('process post data : ');
//    console.log(req.params);
//    console.log(req.query.draw);
    var MongoClient = require('mongodb').MongoClient;
    var MongoDataTable = require('../lib/MongoDataTable');
    var options = req.query;
    options.caseInsensitiveSearch = true;
    options.showAlertOnError = true;
//    console.log('in users: ',options.columns);

    MongoClient.connect('mongodb://localhost:27017/dualven', function (err, db) {
        if (err) {
            console.error(err);
        }

        new MongoDataTable(db).get('codemng', options, function (err, result) {
            if (err) {
                console.error(err);
            }
            console.log(result);
            res.json(result);
        });
    });
});
module.exports = router;
