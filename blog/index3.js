//var a = require('./public/js/mysqlout.js');
//var g = new a('127.0.0.1', '3306', 'dxw', '123456');
//g.setSchem('gwifi', 'think_history_access', 'login_time');
//g.setDate('2017-7-3');
//var ins = g.getCon();
//if (ins) {
//    console.log('it seems ok !')
//    console.log(ins);
//} else {
//    console.log('it seems no t get a instance');
//}
//g.Out();


var b = require('./public/js/mysqlin.js');
var h = new b('127.0.0.1', '3306', 'dxw', '123456','b');
h.setSchem('gwifi', 'think_history_access', 'login_time');
//var ins = h.getCon();
//if (ins) {
//    console.log('it seems ok !')
//    console.log(ins);
//} else {
//    console.log('it seems no t get a instance');
//}
var path= require('path');
//h.In();
var ss = "./public/upload/xlsx/20170912/2.xlsx";
console.log((path.resolve(ss)));



//var s = function () {
//    var m = 1;
//    s.k = function () {
//        console.log('k');
//    }
//    this.kk = function () {
//        console.log('kk');
//        console.log(m);
//        s.k();
//    }
//}
//
//
//var si = new s();
//si.kk();
//s.k();
