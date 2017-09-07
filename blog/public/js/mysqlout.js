//var Out = function (date) {
//    this.LOGIN_TIME = date;
//    this.date = new Date(this.LOGIN_TIME);
//};
var Out = function (ip, port, user, pwd) {
    this.ip = ip;
    this.port = port;
    this.user = user;
    this.pwd = pwd;
};
Out.prototype.go = function () {
    console.log("Out we have,mount %s :", this.LOGIN_TIME);
};
module.exports = Out;
Out.prototype.setSchem = function (database, table, column) {
    this.database = database;
    this.table = table;
    this.column = column;
};
Out.prototype.setDate = function (date) {
    this.LOGIN_TIME = date;
    this.date = new Date(this.LOGIN_TIME);
};
var mysql = require('mysql');
//var TEST_DATABASE = 'gwifi';
//var TEST_TABLE = 'think_history_access';
var ONEQUERY = 30000;
//var KEYFIELD = 'login_time'; //按这个排序与本身的id 排序是一致的，所以可以删除
var dateFormat = require('dateformat');
Out.prototype.getCon = function () {
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
            client = null;
        } else {
            console.log('handler says it is ok!');

        }
    }
    client.connect(handler);
//    client.on('error',handler );
    client.query("use " + this.database);
    return client;
};
Out.prototype.getTables = function (callback) {
    var client = this.getCon();
    var database = this.database;
    var tables = [];
    client.query('show tables;',
            function (err, result) {
                if (err) {
                    console.log('[query tables ERROR] - ', err.message);
                    return 0;
                }
                if (result) {
                    console.log('[query tables suc] - ', result);
                    for (var i = 0; i < result.length; i++) {
//                        console.log(result[i]);
                        console.log(result[i]['Tables_in_' + database]);
                        tables[i] = result[i]['Tables_in_' + database];
                    }
                }
                client.end();
                callback(tables);

            }
    );

};
Out.prototype.getDbs = function (callback) {
    var client = this.getCon();
    var dbs = [];
    client.query('show databases;',
            function (err, result) {
                if (err) {
                    console.log('[query db ERROR] - ', err.message);
                    return 0;
                }
                if (result) {
                    console.log('[query dbs suc] - ', result);
                    for (var i = 0; i < result.length; i++) {
                        console.log(result[i]);
                        dbs[i] = result[i]['Database' ];
                    }
                }
                client.end();
                callback(dbs);

            }
    );

};
Out.prototype.getColumns = function (table, callback) {
    var client = this.getCon();
    var database = this.database;
    var columns = [];
    client.query('show columns from ' + table,
            function (err, result) {
                if (err) {
                    console.log('[query columns ERROR] - ', err.message);
                    return 0;
                }
                if (result) {
                    console.log('[query columns suc] - ', result);
                    for (var i = 0; i < result.length; i++) {
//                        console.log(result[i]);
//                        console.log(result[i]['Field']);
                        columns[i] = result[i]['Field'];
                    }
                }
                client.end();
                callback(columns);

            }
    );

};
Out.prototype.Out = function Out() {
    console.log("%s", this.date.getTime() / 1000);
    var date = this.date.getTime() / 1000;

    var querymount = 'select count(*)as mount  FROM ' + this.table + ' where ' + this.column + ' < ' + date;
    var mount = 0;
    var client = this.getCon();
    var over = false;

    var async = require('async');
    var files = new Array();
    var table = this.table;
    var column = this.column;
    async.series([
        function (callback) {
            client.query(querymount,
                    function (err, result) {
                        if (err) {
                            console.log('[querymount ERROR] - ', err.message);
                            return 0;
                        }
                        if (result) {
                            console.log('[querymount suc] - ', result[0].mount);
                            mount = result[0].mount;
                            console.log("Now we have,mount %s :", mount);
                            //write(mount);
                            over = true;

                        }
                        callback(err, result);
                    }
            );
//            client.end();
        }],
            function (err, results) {
                console.log("after callback3 ,%s", results[0][0].mount );
                files = write(mount, date, client, table, column);
//                lastcallback(files);
//                client.end();
//            this.t1('HH');
            });
       return 0;
}
//write(3);
function write(mount, date, client, table, column) {
    var stage = Math.ceil(mount / ONEQUERY);
    var xlsx = require('node-xlsx');
    var fs = require('fs');
    console.log("Now we have %s, we fen state %s :", mount, stage);
//    var client = getCon();
    var files = new Array();
    for (var i = 0; i < stage; i++) {
        files[i] = writeQuery(i, mount, xlsx, fs, client, date, table, column);
        console.log('in %s , the files is %s :', i, files[i]);
    }
    delRec(client, date, table, column);
    client.end();
    return files;
}
// 包含对数据的删除，不然要记起始位置，会增加复杂度。
//Out.prototype.writeQuery =
function writeQuery(qi, num, xlsx, fs, client, date, table, column) {
    //i ==0 时才要写表头
    var qleft = num - qi * ONEQUERY
    var qnum = qleft > ONEQUERY ? ONEQUERY : qleft;
    var sqls = 'SELECT * FROM ' + table + ' where ' + column + ' < ' + date + ' limit ' + qi * ONEQUERY + ', ' + qnum;
    console.log("%s sql is  %s :", qi, sqls);
    client.query(
            sqls,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                var coldata = [];
                if (fields)
                {
                    for (var i = 0; i < fields.length; i++) {
                        coldata.push(JSON.parse(JSON.stringify(fields[i])).name);
                    }

                }
                if (results)
                {
                    var length = results.length;
                    console.log('length is %s', length);
                    var data2 = [];
                    data2.push(coldata);
                    var start;
                    var end;
                    for (var j = 0; j < length; j++)//
                    {
                        rowdata = [];
                        temp = JSON.parse(JSON.stringify(results[j ]));
                        for (var i = 0; i < fields.length; i++) {
                            rowdata.push(temp[coldata[i]]);
                        }
                        data2.push(rowdata);
                        if (j == 0) {
                            start = dateFormat(new Date(temp[column] * 1000), 'yyyy-mm-dd-HH-MM-ss');
                        }
                        if (j == length - 1) {
                            end = dateFormat(new Date(temp[column] * 1000), 'yyyy-mm-dd-HH-MM-ss');
                        }
                    }
                    var buffer = xlsx.build([{
                            name: table,
                            data: data2
                        }]);
                    console.log("write qi %s, qnum %s,data :  ", qi, qnum);
                    var filename = table + '~' + start + '~' + end + '.xlsx';
                    fs.writeFileSync(filename, buffer, 'binary');
                    console.log('i want to return %s', filename);
                    return filename;
                }
            }
    );

}
//Out.prototype.delRec = 
function delRec(client, date, table, column) {
    var userDelSql = 'DELETE FROM ' + table + ' where ' + column + ' < ' + date;
    client.query(userDelSql,
            function (err, result) {
                if (err) {
                    console.log('[DELETE ERROR] - ', err.message);
                    return;
                }
                if (result) {
                    console.log('[DELETE suc] - ', result);
                    return;
                }
            }
    );
}




