
//var b = require ('./in.js');
//var bb = new b('b.xlsx');
//
//bb.In();
//  
var one = 'aa';
var two ='bb';
module.exports={
    one,
    two
};

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
            console.log(JSON.stringify(result));
            f(result);
            db.close();
        });
    });
}
 var f = function (result) {
     console.log(result);
 }
 mongo(f);
            