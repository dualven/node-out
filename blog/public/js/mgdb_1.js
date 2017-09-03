/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function mongo(callback,DB_CONN_STR,doc){
var MongoClient = require('mongodb').MongoClient;
//var DB_CONN_STR = 'mongodb://localhost:27017/dualven';  

var  selectData = function(db, callback) {  
  //连接到表  
  var collection = db.collection(doc);
  //查询数据
  var whereStr = {};
  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      return;
    }     
    callback(result);
  });
}

MongoClient.connect(DB_CONN_STR, function(err, db) {
  console.log("连接成功------------------！");
  selectData(db, callback);
   db.close();
});
}
module.exports = mongo;