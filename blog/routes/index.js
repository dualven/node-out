var express = require('express');
var router = express.Router();
const path = require('path')
var username = 'duan';
/* GET home page. */
 router.get('/home', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
  })
router.get('/index/profile', function (req, res, next) {
    var name = req.query.name;
    var pwd = req.query.pwd;
    var myDate = new Date();
    myDate = myDate.getMilliseconds();
    res.render('index/profile2', {
        username: 'duanxiongwen',
        usergroup: 'dxw',
        name: name,
        pwd: pwd,
        dtime: myDate
    });
});
router.all('/index/profile', function (req, res, next) {
    console.log('post data : ' + req.body.reservation);
    //    var a = require ('../out.js');
    //    var g = new a('2016-12-25');
    //    g.Out();

    res.render('index/welcome');
});
router.get('/index/in', function (req, res, next) {
    var myDate = new Date();
    myDate = myDate.getMilliseconds();
    res.render('index/in', {
        dtime: myDate
    });
});
router.get('/index/in', function (req, res, next) {
    var myDate = new Date();
    myDate = myDate.getMilliseconds();
    res.render('index/in', {
        dtime: myDate
    });
});

router.get('/index/login3', function (req, res, next) {
    var myDate = new Date();
    myDate = myDate.getMilliseconds();
    res.render('index/in', {
        dtime: myDate
    });
});
router.all('/index/topo', function (req, res, next) {
    res.render('index/topo');
});
router.get('/index/out', function (req, res, next) {
    var myDate = new Date();
    var dateFormat = require('dateformat');
    myDate = Math.ceil(myDate.getTime() / 1000);
    var start = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var end = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    res.render('index/out', {
        'end': end,
        'dtime': start,
        'start': start

    });
});
router.post('/index/out', function (req, res, next) {
    console.log('Out post data : ' + req.body.reservation);
    var enddate = req.body.reservation;
    var exp = enddate.split('- ');
    var start = (exp[0]);
    var end = (exp[1]);
    console.log(end);
    var a = require('../out.js');
    var g = new a(end);
    var files = g.Out();
    console.log(files[0]);
    var myDate = new Date();
    res.render('index/out', {
        dtime: myDate,
        start: start,
        end: end
    });
});
router.get('/index/welcome', function (req, res, next) {
    res.render('index/welcome');
});
//router.get('/', function(req, res, next) {
//    var data = new Array();
//    var _data1 = Array({
//        'name':'导出',
//        'mca':'index/out',
//        'fa_home':'nan'
//    });
//    var _data2 = Array({
//        'name':'导入',
//        'mca':'index/in',
//        'fa_home':'nan22'
//    });
//     var _data3 = Array({
//        'name':'拓扑',
//        'mca':'index/topo',
//        'fa_home':'nan33'
//    });
//    data.push({
//        'name': '导出父菜单',
//        'fa_home':'nan',
//        '_data':_data1
//    });
//    data.push({
//        'name': '导入父菜单',
//        'fa_home':'nan2',
//        '_data':_data2
//    });
//     data.push({
//        'name': '拓扑父菜单',
//        'fa_home':'nan3',
//        '_data':_data3
//    });
//    res.render('index', {
//        username: 'duanxiongwen',
//        usergroup: 'dxw' ,
//        data: data
//    });
//});
function mongo(f) {
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';

    var selectData = function (db, callback) {
        //连接到表  
        var collection = db.collection('fav');
        //查询数据
        var whereStr = {};
        collection.find(whereStr).toArray(function (err, result) {
            if (err)
            {
                console.log('Error:' + err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        console.log("连接成功！");
        selectData(db, function (result) {
//            console.log(JSON.stringify(result));
            f(result);
            db.close();
        });
    });
}

router.get('/', function (req, res, next) {
    console.log(req.session.user);
    if (req.session.user) {
        var f = function (result) {
            res.render('index', {
                username: 'duanxiongwen',
                usergroup: 'dxw',
                data: result
            });
        }
        mongo(f);
    } else {
        res.render('index/login')
    }
});
module.exports = router;
