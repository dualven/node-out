var a = require('./public/js/mysqlout.js');
var g = new a('127.0.0.1', '3306', 'dxw', '123456');
g.setSchem('gwifi', 'think_history_access', 'login_time');
g.setDate('2017-7-3');
var f = function (result) {
        console.log({info: result.status,reason:result.reason});
    }
g.outAll(f);