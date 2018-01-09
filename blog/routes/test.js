/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var info = require('./config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;

 var field = 'id';
    var doc = 'users';
    var f = function (error,result) {
        var max = 0;
        if(result!=null && result.length > 0 ){
            console.log(result);
            result.forEach(function(value,index,array){
                if(Number.parseInt(value[field]) > max){
                    max = Number.parseInt(value[field]);
                }
            });
        }
      console.log(max);
    };
    var query = {};
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getcommonRecords(query);