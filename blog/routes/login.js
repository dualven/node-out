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
    var f = function () {
        res.json({info: "ok!!!!!!!!!!!!!!!!!!!"});
    }
    g.Out();
    f();
});
var formidable = require('formidable');
var fs = require('fs');
router.all('/acceptfile', function (req, res) {
    var form = null;
    form = new formidable.IncomingForm();
    form.keepExtensions = false;		//隐藏后缀
    form.multiples = true;				//多文件上传
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
    for (var file in ffs) {
         console.log(ffs[file]);
        g.inOne(ffs[file]);
    }
    var f = function () {
        res.json({info: "input ok!!!!!!!!!!!!!!!!!!!"});
    }

    f();
});



function uploadOper(fs, gUpload, fileS, resultPath) {
    console.log('uploadOper:');
    console.log(fileS);
    var fileTypeName = fileS.name.substring(fileS.name.lastIndexOf('.') + 1)
            , catDir = gUpload + fileTypeName + '/'
            , catDetailDir = catDir + new Date().format('yyyyMMdd') + '/'
            , uploadPath = catDetailDir + fileS.name;

//    resultPath.push(uploadPath.replace('public/', ''));
    var path= require('path');
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

        res.setHeader('Content-Type', 'text/html');		//很重要，不然ie会弹出保存对话框

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
