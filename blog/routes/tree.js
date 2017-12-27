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
    getAlldata(res, 'Access');
});
router.post('/getCommonTb', function (req, res, next) {
    getAlldata(res, req.body.table);
});
function getAlldata(res, doc) {
    console.log('getAll post data : ');
//    var doc = 'Access';
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
router.post('/getMaxId', function (req, res, next) {
    var doc = req.body.doc;
    var field = req.body.field;
    console.log(doc,field);
    var f = function (error,result) {
        var max = 0;
        if(error == null&& result!=null && result.length > 0 ){
            result.forEach(function(value,index,array){
                if(Number.parseInt(value[field]) > max){
                    max = Number.parseInt(value[field]);
                }
            });
        }
        res.json({
            result: max
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getcommonRecords({});
});
function modifyRow(res, whereStr) {
    console.log('modifyRow whereStr data : ', whereStr);
    var doc = 'Access';
    var f = function (result) {
        refreshPer();
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.commonSave(whereStr, true);
}
function deleteRow(res, whereStr, doc) {
    console.log('deleteRow whereStr data : ', whereStr);

    var f = function (result) {
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.batchDelete(whereStr);
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
    var whereStr = {'id': req.body.id, 'name': req.body.name, 'level': req.body.level, 'parentid': req.body.parentid, 'url': req.body.url};
    modifyRow(res, whereStr);
});
router.all('/passDelete', function (req, res, next) {
    addheaders(res);
    console.log('passdelete post data : ', req.body);
    var condition = [];
    for (i in req.body) {
        condition[i] = req.body[i];
    }
    var whereStr = {id: {$in: condition}};
    var doc = 'Access';
    deleteRow(res, whereStr, doc);
});
router.all('/deleteOneId', function (req, res, next) {
    addheaders(res);
    var doc = req.body.doc;
    console.log('deleteOneId post data : ', req.body);
    if(req.body.id!= null){
    var whereStr = {id: {$in: [req.body.id]}};
    }else{
        delete req.body.doc;
        var whereStr = req.body;
    }
    console.log(whereStr);
    deleteRow(res, whereStr, doc);
});
//修改权限
router.all('/updateG', function (req, res, next) {
    addheaders(res);
    console.log('my-updateG post data : ', req.body);
    var groupinfo = req.body.groupinfo;
    var xx = JSON.parse(groupinfo);
    console.log(xx);
    var change = xx;
    change.permissions = req.body.del;
//    change._id= ObjectId(change._id);
    delete change._id;
    console.log(change);
    var doc = 'groups';
    var f = function (result) {
        refreshPer();
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.commonSave(change, false);
});
//only passchange; updataG need it !
function refreshPer() {
    var aa = require('../example/AccessMng');
    aa.getIns().refreshPermission();
}
//only modify
router.all('/updateUser', function (req, res, next) {
    console.log('my-updateUser post data : ', req.body);
    var doc = 'users';
    var f = function (result) {
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.commonSave(req.body, true);
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
//            console.log(result);
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
//            console.log(result);
            res.json(result);
        });
    });
});
// 新增  废弃了
router.all('/commonSaveuser', function (req, res, next) {
    var doc = 'users';
    //test db
    var f = function (result) {
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    var where = {"id": req.body.id, "name": req.body.name, "sex": req.body.sex, "groupid": req.body.groupid};
    n.commonSave(where, true);
});
router.all('/commonSave', function (req, res, next) {
    console.log('my-commonSave post data : ', req.body.data);
    var doc =req.body.doc;
    var f = function (result) {
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.commonSave(JSON.parse(req.body.data), true);
});
router.all('/playSessions', function (req, res, next) {
    console.log('now playSessions');
    var op = req.body.operator;
    var result;
    if (op === 'set') {
        var who = req.body.somebody;
        var value = req.body.value;
        console.log(who, value);
        req.session.group = value;
        result = {info: 'success'};
    } else if (op === 'get') {
        var who = req.body.somebody;
        var value = req.session.group;
        result = {info: 'success'};
        result[who] = value;
    } else {
        result = {info: 'donothing'};
    }
    res.json(result);
});
router.all('/getGroupaccess', function (req, res, next) {
    addheaders(res);
    console.log('now getGroupaccess');
    var groupid = req.session.group;
    if (groupid == null) {
        groupid = "0"
    }
    console.log('getAll post data : ');
    var doc = 'groups';
    var query = {id: groupid};
    console.log('query is :', query);
    var f = function (result) {
        res.json({
            result: result,
            group: groupid
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
});
module.exports = router;
