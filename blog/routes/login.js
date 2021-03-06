var express = require('express');
var router = express.Router();
var info = require('./config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;
/* GET users listing. */
router.get('/', function (req, res, next) {//login_out
    req.session.destroy();
    res.render('index/login');
});
router.post('/check', function (req, res, next) {
    console.log('come here !');
    console.log(req.body.username);
    console.log(req.body.password);
    var user = req.body.username;
    var pwd = req.body.password;
    var code = 3;
    var msg = '用户校验失败';
    var f = function (result) {
        if (result.code == 0) {
            code = result.code;
            req.session.user = user;
            req.session.role = result.role;
            req.session.roleid = result.roleid;
            msg = '用户登录成功';
        }
        var data = {msg: msg, status: code};
        res.json(data);
    };
    checkuser(user, pwd, f);
//    if (user == 'dxw' && pwd == '123456') {//todo:1 authentication  2 get author to session
//        code = 0;
//        req.session.user = user;
//        req.session.role = 'dxw';
//        req.session.roleid = '5';
//    }
//    var data = {msg: "用户登录成功", status: code};
////    console.log(data.toString());
//    res.json(data);

});
function checkuser(user, pwd, f) {
    var m = require('../public/js/mgdb.js');
    var query = {'name': user, 'password': pwd};
    console.log(query);
    var async = require('async');
    async.series([
        function (callback) {
            var n = new m(callback, DB_CONN_STR, 'users');
            n.getcommonRecords(query);
        },
        function (callback) {
            var n = new m(callback, DB_CONN_STR, 'groups');
            n.getcommonRecords({});
        }
    ],
            function (err, results) {
                if (err == null && results[0] != null && results[0].length > 0) {
                    var roleid = results[0][0].groupid;
                    if (results[1] != null) {
                        results[1].forEach(function (value, index, array) {
                            if (value.id == roleid) {
                                var last = {code: 0, role: value.name, roleid: value.id};
                                f(last);
                            }
                        });
                    } else {
                        var last = {code: 3, role: '0', roleid: '0'};
                        f(last);
                    }
                } else {
                    var last = {code: 3, role: '0', roleid: '0'};
                    f(last);
                }

            }
    );
}
router.get('/db', function (req, res, next) {
    var myDate = new Date();
    //read origin data from db , to init the web view 
    // var DB_CONN_STR = 'mongodb://10.60.0.205:27017/dualven';
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
    // var DB_CONN_STR = 'mongodb://10.60.0.205:27017/dualven';
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
    g.setSchem(req.body.db, " ", " ");
    g.getDbs(f);
});
router.all('/output', function (req, res, next) {
    console.log('output post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    console.log('output post output : ' + req.body.start + "---" + req.body.end);
    console.log('output post output : ' + req.body.db + "---" + req.body.tb + "---" + req.body.co);
    var a = require('../public/js/mysqlout.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, req.body.tb, req.body.co);
    g.setDate(req.body.end);
    var f = function (result) {
        // var DB_CONN_STR = 'mongodb://10.60.0.205:27017/dualven';
        var doc = 'operslog';
        var ff = function (result) {
        }
        var m = require('../public/js/mgdb.js');
        var n = new m(ff, DB_CONN_STR, doc);
        var where = {"ip": req.body.ip, "dbinfo": req.body.db + "-" + req.body.tb + "-" + req.body.co, "oper_time": new Date().format('yyyyMMddhhmmss'),
            "start": req.body.start, "end": req.body.end, "note": result.reason, "code": result.status};
        n.saveOpers(where);
        res.json({info: result.status, reason: result.reason});
    }
    g.outAll(f);
});
var formidable = require('formidable');
var fs = require('fs');
router.all('/acceptfile', function (req, res) {
    var form = null;
    form = new formidable.IncomingForm();
    form.keepExtensions = false; //隐藏后缀
    form.multiples = true; //多文件上传
    form.uploadDir = './public/upload/';
    uploadFileFun(form, req, res, fs);
});
router.all('/inputxlsx', function (req, res) {
    console.log('inputxlsx!!!!!!!!!!!!');
    console.log('inputxlsx post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    console.log('inputxlsx post output : ' + req.body.db + "---" + req.body.tb + "---" + req.body.co);
    var a = require('../public/js/mysqlin.js');
    var g = new a(req.body.ip, req.body.port, req.body.user, req.body.pwd);
    g.setSchem(req.body.db, req.body.tb, "");
    var files = req.body.files;
    console.log(files);
    var ffs = JSON.parse(files);
    var f = function (result) {
        res.json({info: result.status, reason: result.reason});
    }
    for (var file in ffs) {
        console.log(ffs[file]);
        g.inOne(ffs[file], f);
    }


//    f();
});
function uploadOper(fs, gUpload, fileS, resultPath) {
    console.log('uploadOper:');
    console.log(fileS);
    var fileTypeName = fileS.name.substring(fileS.name.lastIndexOf('.') + 1)
            , catDir = gUpload + fileTypeName + '/'
            , catDetailDir = catDir + new Date().format('yyyyMMdd') + '/'
            , uploadPath = catDetailDir + fileS.name;
//    resultPath.push(uploadPath.replace('public/', ''));
    var path = require('path');
    resultPath.push(path.resolve(uploadPath));
    if (fileS.name.lastIndexOf('.') > -1) {	//只能传有后缀的文件，前台上传做个限制（后台暂时没找到方法）
        if (!fs.existsSync(catDir)) {	//2级目录不存在
            fs.mkdirSync(catDir, 0776);
        }

        if (!fs.existsSync(catDetailDir)) {	//3级目录不存在
            fs.mkdirSync(catDetailDir, 0776);
        }

        fs.renameSync(fileS.path, uploadPath);
    }
}

//上传
function uploadFileFun(form, req, res, fs) {
//    console.log(req);
    form.parse(req, function (error, fields, files) {
        console.log('form.parse:');
        console.log(typeof (files));
        var ff = files[Object('file[]')];
        console.log(ff);
        var gUpload = './public/upload/',
                fileS = null,
                resultPath = [];
        if (ff instanceof Array) {
            for (var i = 0; i < ff.length; i++) {
                fileS = ff[i];
                uploadOper(fs, gUpload, fileS, resultPath);
            }

        } else {	//单文件上传
            fileS = ff;
            uploadOper(fs, gUpload, fileS, resultPath);
        }

        res.setHeader('Content-Type', 'text/html'); //很重要，不然ie会弹出保存对话框

        //返回结果
        res.json({
            status: 1000,
            data: {
                url: resultPath
            }
        });
    });
}

//时间格式化
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
module.exports = router;
