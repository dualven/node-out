var Out = function(date){
    this.LOGIN_TIME = date;
    this.date = new Date( this.LOGIN_TIME);
};

Out.prototype.go= function(){
    console.log("Out we have,mount %s :",this.LOGIN_TIME);
};
module.exports= Out;

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
    client.connect();
    client.query("use " + TEST_DATABASE);
    return client;
}
Out.prototype.t1 = function t1(a) {
    console.log('t1!!!%s',a );
    this.t2('bbbbb');
}
Out.prototype.t2 = function t2(b) {
    console.log('sssssss!!!%s',b );
}
Out.prototype.Out = function Out() {
    console.log("%s", this.date.getTime()/1000);
    var date = this.date.getTime()/1000;

    var  querymount = 'select count(*)as mount  FROM '+TEST_TABLE + ' where ' + KEYFIELD + ' < ' + date;
    var mount = 0;
    var client = getCon();
    var over = false;

    var async = require('async');
    var files = new Array();
    async.series([
        function (callback) { 
            client.query(querymount,
                function (err, result) {
                    if(err){
                        console.log('[querymount ERROR] - ',err.message);
                        return 0;
                    }
                    if(result){
                        console.log('[querymount suc] - ',result[0].mount);
                        mount = result[0].mount;
                        console.log("Now we have,mount %s :",mount);
                        //write(mount);
                        over = true;
           
                    }
                    callback(err,result);
                }
                );
         client.end();
        }],
        function (err, results) {
            console.log("after callback3 ,%s",results[0][0].mount );
           files =  write(mount,date);
//            this.t1('HH');
        });
    console.log("Out we have,mount %s :",mount);
    return files;
}
//write(3);
function write(mount,date){
    var stage = Math.ceil(mount/ONEQUERY);
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    console.log("Now we have %s, we fen state %s :",mount,stage);
    var client = getCon();
    var files = new Array();
    for(var i = 0; i< stage ; i ++){
       files[i] =  writeQuery(i,mount,xlsx,fs,client,date);
       console.log('in %s , the files is %s :',i,files[i]);
    }
    delRec(client,date);
    client.end();
    return files;
}
// 包含对数据的删除，不然要记起始位置，会增加复杂度。
//Out.prototype.writeQuery =
function writeQuery(qi,num,xlsx,fs,client,date){
    //i ==0 时才要写表头
    var qleft = num - qi* ONEQUERY
    var qnum = qleft > ONEQUERY? ONEQUERY: qleft;
    var sqls = 'SELECT * FROM '+TEST_TABLE + ' where ' + KEYFIELD + ' < ' + date + ' limit ' +qi* ONEQUERY+', '+ qnum;
    console.log("%s sql is  %s :",qi,sqls);
    client.query(  
        sqls,  
        function selectCb(err, results, fields) {  
            if (err) {  
                throw err;  
            }  
            var coldata =[];
            if(fields )
            {
                for(var i = 0; i < fields.length; i++){
                    coldata.push(JSON.parse(JSON.stringify(fields[i])).name);
                }
       
            }
            if(results)
            {
                var length = results.length;
                console.log('length is %s',length);
                var data2 = [];
                data2.push(coldata);
                var start;
                var end;
                for(var j = 0; j <length ; j++)//
                {
                    rowdata =[];
                    temp =JSON.parse(JSON.stringify(results[j ]));
                    for(var i = 0; i < fields.length; i++){
                        rowdata.push(temp[coldata[i]]);
                    }
                    data2.push(rowdata);
                    if(j==0){
                        start = dateFormat(new Date(temp[KEYFIELD] * 1000), 'yyyy-mm-dd-HH-MM-ss');
                    }
                    if(j==length -1 ){
                        end = dateFormat(new Date(temp[KEYFIELD] * 1000), 'yyyy-mm-dd-HH-MM-ss');
                    }  
                }	
                var buffer = xlsx.build([{
                    name: TEST_TABLE, 
                    data: data2
                }]);
                console.log("write qi %s, qnum %s,data :  ",qi,qnum);
                var filename = TEST_TABLE+ '~'+ start+'~'+ end +'.xlsx';
                fs.writeFileSync(filename, buffer, 'binary');
                console.log('i want to return %s', filename);
                return filename;
            }    
        }  
        );
          
}
//Out.prototype.delRec = 
function delRec(client,date){
    var  userDelSql = 'DELETE FROM '+TEST_TABLE + ' where ' + KEYFIELD + ' < ' + date;
    client.query(userDelSql,
        function (err, result) {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }
            if(result){
                console.log('[DELETE suc] - ',result);
                return;
            }
        }
        );
}




