/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function mongo(callback, DB_CONN_STR, doc) {
    this.MongoClient = require('mongodb').MongoClient;
    this.DB_CONN_STR = DB_CONN_STR;
    this.doc = doc;
    this.callback = callback;
//var DB_CONN_STR = 'mongodb://localhost:27017/dualven';  
}
mongo.prototype.selectData = function (db, callback, doc) {
    //连接到表  
    var collection = db.collection(doc);
    //查询数据
    var whereStr = {};
    collection.find(whereStr).toArray(function (err, result) {
        if (err)
        {
            console.log('Error:' + err);

            return;
        }
        console.log("selectData: success ,before callback");
        callback(result);
    });
};
//check if there is a same record & if not  ,save it !
mongo.prototype.saveData = function (db, callback, doc, ip, port, user, pwd) {
    //连接到表  
    var collection = db.collection(doc);
    //查询数据
    var whereStr = {'db-port': port, 'db-ip': ip, 'db-username': user, 'db-password': pwd};
    console.log('wherestr insert is :' + JSON.stringify(whereStr));
    collection.find(whereStr).toArray(function (err, result) {
        if (err || result.length == 0)
        {
            console.log('there is no same record:' + err);
            var k = collection.insert(whereStr);
            console.log('after insert whereStr:' + JSON.stringify(whereStr));
            console.log('kkkkkkkkkkkkkkkk' + JSON.stringify(k));
            whereStr['info'] = 3;
            callback([whereStr]);
        } else {
            console.log("saveData: no  " + JSON.stringify(result));
            console.log("saveData: no  ,before callback,has same records");
            whereStr['info'] = 2;
            callback([whereStr]);
        }
        db.close();
    });
};
mongo.prototype.executeSelect = function ()
{
    var selectD = this.selectData;
    var callback = this.callback;
    var doc = this.doc;
    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        console.log("executeSelect:连接成功------------------！" + err);
        selectD(db, callback, doc);
        db.close();
    });
};
//测试是否连接成功, 成功则存入数据库
mongo.prototype.checkCon = function (ip, port, user, pwd)
{
    var saveData = this.saveData;
    var callback = this.callback;
    var doc = this.doc;
    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        if (!err) {
            console.log("checkcon: 连接成功------------------！");

            var a = require('./mysqlout.js');
            var g = new a(ip, port, user, pwd);
            g.setSchem('gwifi', 'think_history_access', 'login_time');
            var client = g.getCon();
            client.query('show databases',
                    function (err, result) {
                        if (err) {
                            console.log('[querymount ERROR] - ', err.message);
                            db.close();
                            var rr = {'info': 0};
                            callback([rr]);
                        }
                        if (result) {
                            console.log('query succ');
                            var issuc = saveData(db, callback, doc, ip, port, user, pwd);


                        }
                    }
            );
        } else {
            console.log("checkCon:连接失败------------------！");
            db.close();
            var rr = {'info': 0};
            callback([rr]);
        }
    });
};
module.exports = mongo;