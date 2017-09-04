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
        callback(result);
    });
};
//check if there is a same record & if not  ,save it !
mongo.prototype.saveData = function (db, callback, doc, ip, port, user, pwd) {
    //连接到表  
    var collection = db.collection(doc);
    //查询数据
    var whereStr = {'db-port': port, 'db-ip': ip, 'db-username': user, 'db-password': pwd};
    collection.find(whereStr).toArray(function (err, result) {
        if (err)
        {
            console.log('there is no same record:' + err);
            collection.insert(where);
            return true;
        }
        callback(result);
        return false;
    });
};
mongo.prototype.executeSelect = function ()
{
    var selectD = this.selectData;
    var callback = this.callback;
    var doc = this.doc;
    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        console.log("连接成功------------------！" + err);
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
            console.log("连接成功------------------！");
            var issuc = saveData(db, callback, doc, ip, port, user, pwd);
            db.close();
            if (issuc) {
                return 3;
            } else {
                return 2;
            }
        } else {
            console.log("连接失败------------------！");
            db.close();
            return 0;
        }
    });
};
module.exports = mongo;