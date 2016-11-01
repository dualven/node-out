//��������� ���ڣ��ڴ�����֮ǰ�����ݵ���
//�߼������������У����������ڵ���ʼ���β��Ϊ�ļ����������Χ��������ʮ��֮�࣬����һ���ļ���
//������ݳ���ʮ���Զ�������һ���ļ���
//eg: 2016-6-1  ����Ŀ����� 2016-1-1~2016-3-1, 2016-3-2~2016-6-1, �ڶ����ļ������ݿ��ܲ���ʮ��
var mysql = require('mysql');  
var TEST_DATABASE = 'gwifi';  
var TEST_TABLE = 'think_history_access';  
var LOGIN_TIME ='2016-06-04';
var ONEUNIT = 2;//100000;
var KEYFIELD= 'login_time'; 
var options = process.argv;
for(var i=0;i<options.length;i++)
{
  //console.log("%s", options[i]);
}
LOGIN_TIME=options[2];
console.log("%s", LOGIN_TIME);
//��������  
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
		              rowdata.push(temp[coldata[i]]);
		            }
		          data2.push(rowdata);
		          if(j==0){
		          	start = dateFormat(new Date(temp[KEYFIELD] * 1000), 'yyyy-mm-dd');
		          }
		          if(j==num -1 ){
		          	end = dateFormat(new Date(temp[KEYFIELD] * 1000), 'yyyy-mm-dd');
		          }
		        }	
		         console.log("%s",data2);
		        var buffer = xlsx.build([{name: TEST_TABLE, data: data2  }]);
            fs.writeFileSync(TEST_TABLE+ '~'+ start+'~'+ end +'.xlsx', buffer, 'binary');
      	 }
      }    
      
      
     
    
  }  
);
 var  userDelSql = 'DELETE FROM '+TEST_TABLE + ' where ' + KEYFIELD + ' < ' + date.getTime()/1000;
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
 client.end();  


