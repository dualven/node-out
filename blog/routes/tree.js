var express = require('express');
var router = express.Router();
var info = require('./config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/getAccess', function (req, res, next) {
    addheaders(res);
    getAlldata(res);
});
function getAlldata(res) {
    console.log('getAll post data : ');
    var doc = 'Access';
    var query = {};
    console.log('query is :' + query);
    var f = function (result) {
       res.json({
        result: result
       });
   };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
}
function modifyRow(res,whereStr) {
    console.log('modifyRow whereStr data : ',whereStr);
    var doc = 'Access';
    var f = function (result) {
       res.json({
        result: result
       });
   };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.commonSave( whereStr);
}
function deleteRow(res, whereStr) {
  console.log('deleteRow whereStr data : ',whereStr);
    var doc = 'Access';
    var f = function (result) {
       res.json({
        result: result
       });
   };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.batchDelete( whereStr);
}
function addheaders(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}
router.all('/passChange', function (req, res, next) {
    addheaders(res);
    console.log('passChange post data : ', req.body);
    var whereStr = {'id': req.body.id, 'name': req.body.name, 'level': req.body.level, 'parentid': req.body.parentid,'url': req.body.url}; 
    modifyRow(res,whereStr);
});
router.all('/passDelete', function (req, res, next) {
    addheaders(res);
    console.log('passdelete post data : ', req.body); 
    var condition=[];
    for(i in req.body){
        condition[i] = req.body[i];
    }
    var whereStr = { id: { $in:condition } }; 
    deleteRow(res,whereStr);
});

router.get('/usersmng', function (req, res, next) {
     console.log('process post data : ');
    var MongoClient = require('mongodb').MongoClient;
    var MongoDataTable = require('../lib/MongoDataTable');
    var options = req.query;
    options.caseInsensitiveSearch = true;
    options.showAlertOnError = true;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.error(err);
        }

        new MongoDataTable(db).get('users', options, function (err, result) {
            if (err) {
                console.error(err);
            }
            console.log(result);
            res.json(result);
        });
    });
});
router.get('/groupsmng', function (req, res, next) {
     console.log('process post data : ');
    var MongoClient = require('mongodb').MongoClient;
    var MongoDataTable = require('../lib/MongoDataTable');
    var options = req.query;
    options.caseInsensitiveSearch = true;
    options.showAlertOnError = true;

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.error(err);
        }

        new MongoDataTable(db).get('groups', options, function (err, result) {
            if (err) {
                console.error(err);
            }
            console.log(result);
            res.json(result);
        });
    });
});
router.all('/commonSaveuser', function (req, res, next) {
    var doc = 'users';
    //test db
    var f = function (result) {
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    var where = {"id": req.body.id, "name":  req.body.name , "sex": req.body.sex, "groupid": req.body.groupid};
    n.commonSave(where);
});
router.all('/commonSavegroup', function (req, res, next) {
    var doc = 'users';
    //test db
    var f = function (result) {
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    var where = {"id": req.body.id, "name":  req.body.name , "sex": req.body.sex, "groupid": req.body.groupid};
    n.commonSave(where);
});
router.all('/playSessions', function (req, res, next) {
    console.log('now playSessions');
    var op = req.body.operator;
    var result;
    if(op === 'set'){
        var who = req.body.somebody;
        var value = req.body.value;
        console.log(who,value);
        req.session.group = value;
        result = { info:'success'};
    }else if (op === 'get'){
        var who = req.body.somebody;
        var value = req.session.group;
         result = { info:'success'};
         result[who]= value;
    }else{
        result = { info:'donothing'};
    }
     res.json(result);
});
module.exports = router;
