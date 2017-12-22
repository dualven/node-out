var express = require('express');
var router = express.Router();
const path = require('path')
var username = 'duan';
var info = require('./config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;
/* GET home page. */
router.get('/home', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
})
router.get('/user', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
})
router.get('/about', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
})
router.get('/product', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
})
router.get('/solution', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../index.html'))
})
router.get('/treedist', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../treedist/tree.html'))//index.html会让这个文件暴露给/
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
router.get('/index/codemng', function (req, res, next) {
    var myDate = new Date();
    var dateFormat = require('dateformat');
    myDate = Math.ceil(myDate.getTime() / 1000);
    var start = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var end = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    res.render('index/codemng', {
        'end': end,
        'dtime': start,
        'start': start

    });
});
router.get('/index/users', function (req, res, next) {
    var myDate = new Date();
    var dateFormat = require('dateformat');
    myDate = Math.ceil(myDate.getTime() / 1000);
    var start = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var end = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    res.render('index/users', {
        'end': end,
        'dtime': start,
        'start': start

    });
});
router.get('/index/groups', function (req, res, next) {
    var myDate = new Date();
    var dateFormat = require('dateformat');
    myDate = Math.ceil(myDate.getTime() / 1000);
    var start = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    var end = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    res.render('index/groups', {
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
function getMenu(callback) {
    var query = {'level': {'$in': ["0", "1"]}};
    var publics = [];
    var doc = 'Access';
    console.log('query is :' + query);
    var f = function (result) {
        result.forEach(function (value, index, array) {
            if (value.level == '0' && value.id != '11' && value.parentid != '11') {
                publics[value.id] = {};
                publics[value.id].name = value.name;
                publics[value.id]._data = [];
            }
        });
        result.forEach(function (value, index, array) {
            if (value.level == '1' && value.id != '11' && value.parentid != '11' && value.url != null) {
                console.log('now it is :', value.name, value.id);
                if (publics[value.parentid]._data == null) {
                    publics[value.parentid]._data = [];
                }

                publics[value.parentid]._data[value.id] = {};
                publics[value.parentid]._data[value.id].name = value.name;
                publics[value.parentid]._data[value.id].mca = value.url;
            }
        });
//        delete publics[0];
        console.log((publics));
//        publics.forEach(
//                function (value, index, array) {
//                    console.log(value.name, value._data);
//                }
//        );
        callback(publics);//

    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
}
function mongo(f) {
    var MongoClient = require('mongodb').MongoClient;
    // var DB_CONN_STR = 'mongodb://10.60.0.205:27017/dualven';

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
            console.log(result);
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
//        mongo(f);
        getMenu(f);
    } else {
        res.render('index/login')
    }
});
module.exports = router;
