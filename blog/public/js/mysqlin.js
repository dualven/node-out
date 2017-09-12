/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var In = function (ip, port, user, pwd, name) {
    this.ip = ip;
    this.port = port;
    this.user = user;
    this.pwd = pwd;
    this.filename = name;
};
module.exports = In;
In.prototype.setSchem = function (database, table, column) {
    this.database = database;
    this.table = table;
    this.column = column;
};

var mysql = require('mysql');
In.prototype.getCon = function () {
    var client = mysql.createConnection({
        host: this.ip,
        user: this.user,
        password: this.pwd,
        port: this.port,
        connectTimeout: 100000//it is very important, its priority is higher than evn 's connect_timeout 
    });
    var handler = function (error) {
        if (error) {
            console.log('error is:' + error);
        } else {
            console.log('handler says it is ok !');

        }
    };
    client.connect(handler);
    client.query("use " + this.database);
    console.log(this.database + 'success!' + this.ip + '-- ' + this.port + this.user + '-- ' + this.pwd);
    return client;
};
In.prototype.In = function () {
    var fs = require('fs');
    var table = this.table;
    var client = this.getCon();
    getAllFiles('./', function (name) {
        if (endWith(name, '.xlsx')) {
            console.log('the name is %s', name);
            var sql = readfile(name, table);
            client.query(sql,
                    function (err, result) {
                        if (err) {
                            console.log('[insert ERROR] - ', err.message);
                        }
                        if (result) {
                            console.log('[insert suc] - ', result.insertId);

                        }

                    }
            );
            fs.unlinkSync(name);
            console.log('delete file: - %s', name);
        }

    });
    client.end();


};
In.prototype.inServeral = function (files) {
    var fs = require('fs');
    var table = this.table;
    var client = this.getCon();
    for (var file in files) {
        if (endWith(file, '.xlsx')) {
            console.log('the name is %s', file);
            var sql = readfile(file, table);
            client.query(sql,
                    function (err, result) {
                        if (err) {
                            console.log('[insert ERROR] - ', err.message);
                        }
                        if (result) {
                            console.log('[insert suc] - ', result.insertId);

                        }

                    }
            );
            fs.unlinkSync(name);
            console.log('delete file: - %s', name);
        }

    }
    ;
    client.end();


};
In.prototype.inOne = function (file) {
    console.log('in ONe');
//    var fs = require('fs');
    var table = this.table;
    var client = this.getCon();
    console.log('files inONe: ' +file);
    var sql = readfile(file, table);
    client.query(sql,
            function (err, result) {
                if (err) {
                    console.log('[insert ERROR] - ', err.message);
                }
                if (result) {
                    console.log('[insert suc] - ', result.insertId);

                }
                client.end();
            }
    );
//    fs.unlinkSync(file);
    console.log('delete file: - %s', file);
};
var readfile = function (name, table) {
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    var workSheetsFromBuffer = xlsx.parse(fs.readFileSync(name));
    console.log(workSheetsFromBuffer[0].data);
    var data = workSheetsFromBuffer[0].data;
    var sql = 'Insert  into ' + table;
    var length = data.length;//(data.length>5000?5000:data.length);mysql>set global max_allowed_packet=524288000
    var row = '';
    for (var i = 0; i < length; i++) {
        if (i == 0) {
            sql = sql + ' (';
            sql = sql + data[i];
            sql = sql + ') values  ';
            continue;
        }
        row = '';
        for (var j = 0; j < data[i].length; j++) {
            if (j == 0) {
                row = "(" + '\'' + ((typeof data[i][j]) == 'undefined' ? '' : data[i][j]) + '\'';
            } else {
                row = row + ',' + '\'' + ((typeof data[i][j]) == 'undefined' ? '' : data[i][j]) + '\''
            }

        }
        row = row + ') ' + ((i == length - 1) ? '' : ',');
        sql = sql + row;
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
function async(arr, callback1, callback2) {
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
;
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
};
function endWith(o, s) {
    if (s == null || s == "" || o.length == 0 || s.length > o.length)
        return false;
    if (o.substring(o.length - s.length) == s)
        return true;
    else
        return false;
}
;