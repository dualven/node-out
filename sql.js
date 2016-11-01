//输入参数： 日期，在此日期之前的数据导出
//逻辑：导出过程中，将数据日期的起始与结尾作为文件名，如果范围内数据在十万之类，则在一个文件；
//如果数据超过十万，自动新生成一个文件。
//eg: 2016-6-1  输出的可能是 2016-1-1~2016-3-1, 2016-3-2~2016-6-1, 第二个文件的数据可能不足十万。
var mysql = require('mysql');  
var TEST_DATABASE = 'gwifi';  
var TEST_TABLE = 'think_user_access';  
var LOGIN_TIME ='2016-06-04';
var ONEUNIT = 100000;
var KEYFIELD= 'login_time'; 
//创建连接  
var client = mysql.createConnection({  
  user: 'root',  
  password: 'gbcom123',  
  port: '33016',
});  
var dateformat = require('dateformat');
var date = new Date( LOGIN_TIME);
  console.log("%s", date.getTime()/1000);
 console.log("%s", dateformat(date.getTime()/1000, 'yyyy-mm-dd'));
var data2 = [];
client.connect();
client.query("use " + TEST_DATABASE);

client.query(  
  'SELECT * FROM '+TEST_TABLE + ' where ' + KEYFIELD + ' < ' + date.getTime()/1000+ ' order by ' + KEYFIELD + ' asc',  
  function selectCb(err, results, fields) {  
    if (err) {  
      throw err;  
    }  
    var coldata =[];
    if(fields)
    {
      	 for(var i = 0; i < fields.length; i++){
          coldata.push(JSON.parse(JSON.stringify(fields[i])).name);
        }
        data2.push(coldata);
     }
     if(results)
     {
      	 var length = results.length;
      	 var stage = length/ONEUNIT;
      	 
       // for(var j = 0; j < results.length; j++)
        for(var j = 0; j <100000; j++)
        {
        	  if(j< 10){
             console.log("%d\t%s\t%s\t%s",j, results[j].mac, results[j].ip, results[j].login_time);
            }else{
            	 console.log("%d",j);
            }
            rowdata =[];
      	    for(var i = 0; i < fields.length; i++){
      	    
              rowdata.push(JSON.parse(JSON.stringify(results[j>(results.length-1)?results.length-1:j]))[coldata[i]]);
             //rowdata.push(JSON.parse(JSON.stringify(results[j]))[JSON.parse(JSON.stringify(fields[i])).name]);
            }
          data2.push(rowdata);
        }
     }    
      var xlsx = require('node-xlsx');
      var fs = require('fs');
      var buffer = xlsx.build([{name: "accessdata", data: data2  }]);
      fs.writeFileSync('b2.xlsx', buffer, 'binary');
    client.end();  
    
  }  
);


