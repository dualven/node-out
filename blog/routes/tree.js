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
    var query = {"id":{$gt : 0}};
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
module.exports = router;
