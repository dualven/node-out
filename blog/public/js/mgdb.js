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
/**
 * 
 * @param {type} query
 * @returns {undefined}
 * 与getIPRecords唯一区别  callback(err,result)
 */
mongo.prototype.getcommonRecords = function (query)
{
    var getRs = this.getRs;
    var callback = this.callback;
    var doc = this.doc;
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        getRs(db, callback, doc, query);
        db.close();
    });
};
mongo.prototype.getIPRecords = function (query)
{
    var getIPs = this.getIPs;
    var callback = this.callback;
    var doc = this.doc;
//    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
//        console.log("getIPRecords:连接成功------------------！" + err);
        getIPs(db, callback, doc, query);
        db.close();
    });
};
mongo.prototype.getIPs = function (db, callback, doc, query) {
    //连接到表  
    var collection = db.collection(doc);
    //查询数据
//    console.log(query);
    collection.find(query).toArray(function (err, result) {
        if (err)
        {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
mongo.prototype.getRs = function (db, callback, doc, query) {
    var collection = db.collection(doc);
    collection.find(query).toArray(function (err, result) {
        callback(err, result);
    });
};
//check if there is a same record & if not  ,save it !
mongo.prototype.saveData = function (db, callback, doc, ip, port, user, pwd) {
    //连接到表  
    var collection = db.collection(doc);
    //查询数据
    var whereStr = {'db-port': port, 'db-ip': ip, 'db-username': user, 'db-password': pwd};
//    console.log('wherestr insert is :' + JSON.stringify(whereStr));
    collection.find(whereStr).toArray(function (err, result) {
        if (err || result.length == 0)
        {
//            console.log('there is no same record:' + err);
            var k = collection.insert(whereStr);
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
//check if there is a same record & if not  ,save it !
mongo.prototype.commonSave = function (whereStr, createnot) {
    //连接到表  
    var callback = this.callback;
    var doc = this.doc;
//    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        if (!err) {
            console.log("commonSave: 连接成功------------------！");
            var collection = db.collection(doc);
            //查询数据
//            console.log('wherestr save is :' + JSON.stringify(whereStr));
//            collection.save(whereStr);
            collection.update({id: whereStr.id}, whereStr, {upsert: createnot});
            callback([whereStr]);
            db.close();
        } else {
            console.log("commonSave:连接失败------------------！");
            db.close();
            var rr = {'info': 0};
            callback([rr]);
        }
    });

};
mongo.prototype.batchDelete = function (whereStr) {
    //连接到表  
    var callback = this.callback;
    var doc = this.doc;
//    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        if (!err) {
            console.log("batchDelete: 连接成功------------------！");
            var collection = db.collection(doc);
            console.log('wherestr batchDelete is :', whereStr);
            collection.remove(whereStr);
            callback([whereStr]);
            db.close();
        } else {
            console.log("batchDelete:连接失败------------------！");
            db.close();
            var rr = {'info': 0};
            callback([rr]);
        }
    });

};
mongo.prototype.executeSelect = function ()
{
    var selectD = this.selectData;
    var callback = this.callback;
    var doc = this.doc;
//    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
//        console.log("executeSelect:连接成功------------------！" + err);
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
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        if (!err) {
//            console.log("checkcon: 连接成功------------------！");

            var a = require('./mysqlout.js');
            var g = new a(ip, port, user, pwd);
            g.setSchem('mysql', '', '');
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
                        client.end();
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
mongo.prototype.saveOpers = function (where)
{
    var callback = this.callback;
    var doc = this.doc;
    console.log("let me see ------------------！" + this.DB_CONN_STR);
    this.MongoClient.connect(this.DB_CONN_STR, function (err, db) {
        if (!err) {
            console.log("checkcon: 连接成功------------------！");
            var collection = db.collection(doc);
            //查询数据
            console.log('wherestr insert is :' + JSON.stringify(where));
            collection.find(where).toArray(function (err, result) {
                if (err || result.length == 0)
                {
                    console.log('there is no same record:' + err);
                    var k = collection.insert(where);
                    console.log('after insert whereStr:' + JSON.stringify(where));
                    console.log('kkkkkkkkkkkkkkkk' + JSON.stringify(k));
                    where['info'] = 3;
                    callback(where);
                } else {
                    console.log("saveData: no  " + JSON.stringify(result));
                    console.log("saveData: no  ,before callback,has same records");
                    where['info'] = 2;
                    callback(where);
                }
                db.close();
            });

        } else {
            console.log("checkCon:连接失败------------------！");
            db.close();
            var rr = {'info': 0};
            callback(rr);
        }
    });
};
module.exports = mongo;