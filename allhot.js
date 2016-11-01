//输入参数： 日期，在此日期之前的数据导出
//逻辑：导出过程中，将数据日期的起始与结尾作为文件名，如果范围内数据在十万之类，则在一个文件；
//如果数据超过十万，自动新生成一个文件。
//eg: 2016-6-1  输出的可能是 2016-1-1~2016-3-1, 2016-3-2~2016-6-1, 第二个文件的数据可能不足十万。
var mysql = require('mysql');  
var TEST_DATABASE = 'gwifi';  
var TEST_TABLE = 'think_hotspot';  
var LOGIN_TIME ='2016-06-04';
var ONEUNIT = 10000;//100000;
var KEYFIELD= 'login_time'; 
var options = process.argv;
for(var i=0;i<options.length;i++)
{
  //console.log("%s", options[i]);
}
LOGIN_TIME=options[2];
console.log("%s", LOGIN_TIME);
//创建连接  
var client = mysql.createConnection({  
  user: 'root',  
  password: 'gbcom123',  
  port: '33016',
});  
var dateFormat = require('dateformat');
var date = new Date( LOGIN_TIME);
  console.log("%s", date.getTime()/1000);
client.connect();
client.query("use " + TEST_DATABASE);
var sqlsen = "select h.id as id ," +
"h.name as name , "  + 
"h.gw_id as gw_id,"+ 
"(select c.name from think_region c where c.id =h.province)  as province,"+ 
"(select c.name from think_region c where c.id =h.city)  as city,"+ 
"(select c.name from think_region c where c.id =h.district)  as district,"+ 
"h.street_address as street_address,"+ 
"(select cus.name from think_customer cus where cus.id =h.customer_id)  as customername,"+ 
"h.last_heartbeat_at as last_heartbeat_at"+ 
" from "+ 
"(select id ,name ,gw_id, province,city,district, street_address,customer_id,last_heartbeat_at from think_hotspot) h ";
client.query(  
  sqlsen ,  
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
       
     }
     if(results)
     {
      	 var length = results.length;
      	 var stage = parseInt(length/ONEUNIT);
      	 var xlsx = require('node-xlsx');
         var fs = require('fs');
      	 for(var k = 0; k < stage + 1; k ++)
      	 {
      	 	  var data2 = [];
      	 	  data2.push(coldata);
      	 	  left = length - k*ONEUNIT;
      	 	  if(left == 0 ) continue;
      	 	  
      	 	  var start;
      	 	  var end;
      	 	  num = left> ONEUNIT? ONEUNIT: left;
	      	 	for(var j = 0; j <num ; j++)//
		        {
		            rowdata =[];
		            temp =JSON.parse(JSON.stringify(results[k*ONEUNIT + j ]));
		      	    for(var i = 0; i < fields.length; i++){
		      	    	if(i == fields.length-1)
		      	    	{
		      	    		 now = parseInt((new Date()).getTime()/1000);
		      	    		 console.log("%s\t%s",temp[coldata[i]],now);
		      	    		temp[coldata[i]]= temp[coldata[i]]> (now-5*60)? 'online': 'offline';
		      	    	}
		              rowdata.push(temp[coldata[i]]);
		            }
		          data2.push(rowdata);
		          
		        }	
		        console.log("%s",data2);
		        var buffer = xlsx.build([{name: TEST_TABLE, data: data2  }]);
            fs.writeFileSync(TEST_TABLE +'.xlsx', buffer, 'binary');
      	 }
      }    
      
      
     
    
  }  
);
 
 client.end();  


