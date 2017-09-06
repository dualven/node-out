var b = require('./public/js/mysqlin.js');
var h = new b('127.0.0.1', '3306', 'dxw', '123456','b');
h.setSchem('gwifi', 'think_history_access', 'login_time');
//var ins = h.getCon();
//if (ins) {
//    console.log('it seems ok !')
////    console.log(ins);
//} else {
//    console.log('it seems no t get a instance');
//}
//ins.end();
h.In();


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
