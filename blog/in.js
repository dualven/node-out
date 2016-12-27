/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var In = function(name){
    this.filename = name;
};
module.exports= In;
var mysql = require('mysql');  
var TEST_DATABASE = 'gwifi';  
var TEST_TABLE = 'think_history_access';  
var ONEQUERY = 30000;
var KEYFIELD= 'login_time'; //按这个排序与本身的id 排序是一致的，所以可以删除
var dateFormat = require('dateformat');
function getCon(){
    var client = mysql.createConnection({  
        host: '127.0.0.1',
        user: 'root',  
        password: '123456',  
        port: '3306',
    }); 
//      client.connect(function (err) {
//        if (err) {
//            console.log('error when connecting to db:', err);
//            setTimeout(handleError , 2000);
//        }
//    });
//
//    client.on('error', function (err) {
//        console.log('db error', err);
//        // 如果是连接断开，自动重新连接
//        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//            handleError();
//        } else {
//            throw err;
//        }
//    });
    client.connect();
    
    client.query("use " + TEST_DATABASE);
    return client;
}
In.prototype.In = function In() {
    var fs = require('fs');
    
    getAllFiles('./',function(name){
        if(endWith(name , '.xlsx')){
            console.log('the name is %s', name );
            var  sql = readfile(name);
            var client = getCon();
            client.query(sql,
                function (err, result) {
                    if(err){
                        console.log('[insert ERROR] - ',err.message);
                    }
                    if(result){
                        console.log('[insert suc] - ',result.insertId);
           
                    }
                    client.end();
                }
                );
                 fs.unlinkSync(name);
            console.log('delete file: - %s',name);
        }
     
    });
   
   
   
}
readfile = function readfile(name){
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(name));
    console.log(workSheetsFromBuffer[0].data);
    var data = workSheetsFromBuffer[0].data;
    var sql = 'Insert  into '+ TEST_TABLE ;
    var length = data.length;//(data.length>5000?5000:data.length);mysql>set global max_allowed_packet=524288000
    var row = '';
    for(var i = 0 ; i< length; i ++){
        if(i == 0){
            sql = sql + ' (';
            sql = sql + data[i];
            sql = sql + ') values  ';
            continue;
        }
        row = '';
        for(var j = 0 ; j < data[i].length; j ++){
            if(j==0){
                row = "(" + '\''+ ((typeof data[i][j])== 'undefined'?'':data[i][j]) + '\'' ;
            }else{
                row = row +',' +'\''+ ((typeof data[i][j])== 'undefined'?'':data[i][j]) + '\''
            }
        }
        row = row + ') '+((i == length -1)?'':',');
        sql = sql + row ;
    }
//    console.log(sql);
    return sql; 
}
/**
 * 控制流/同步
 * @param {Array} arr
 * @param {Function} callback1 传递两个参数 (item,next)，执行完一项则需执行next()才能执行下一项
 * @param {Function} callback2 出错或执行完时回调
 * @returns {*}
 */
function async (arr, callback1, callback2) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return callback2(new Error('第一个参数必须为数组'));
    }
    if (arr.length === 0)
        return callback2(null);
    (function walk(i) {
        if (i >= arr.length) {
            return callback2(null);
        }
        callback1(arr[i], function () {
            walk(++i);
        });
    })(0);
}
getAllFiles = function (dir, callback) {
    var filesArr = [];
    var fs = require('fs');
    dir = ///$/.test(dir) ? dir : dir + '/';
    (function dir(dirpath, fn) {
        var files = fs.readdirSync(dirpath);
        async(files, function (item, next) {
            var info = fs.statSync(dirpath + item);
            if (info.isDirectory()) {
                dir(dirpath + item + '/', function () {
                    next();
                });
            } else {
                filesArr.push(dirpath + item);
                callback && callback(dirpath + item);
                next();
            }
        }, function (err) {
            !err && fn && fn();
        });
    })(dir);
    return filesArr;
}
 function endWith (o,s){
    if(s==null||s==""||o.length==0||s.length>o.length)
        return false;
    if(o.substring(o.length-s.length)==s)
        return true;
    else
        return false;
}