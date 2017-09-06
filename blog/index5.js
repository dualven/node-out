var a = require('./public/js/mysqlout.js');
var g = new a('127.0.0.1', '3306', 'dxw', '123456');
g.setSchem('gwifi', 'think_history_access', 'login_time');
var client = g.getCon();
var async = require('async');
var mount = 0;
async.series([
    function (callback) {
        client.query('select count(*) as mount  from ' + "think_history_access",
                function (err, result) {
                    if (err) {
                        console.log('[querymount ERROR] - ', err.message);
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
    },
    function (callback) {
        client.query('select count(*) as mount2  from ' + "think_access",
                function (err, result) {
                    if (err) {
                        console.log('[querymount2 ERROR] - ', err.message);
                    }
                    if (result) {
                        console.log('[querymount2 suc] - ', result[0].mount2);
                        mount = result[0].mount2;
                        console.log("Now we have,moun2t %s :", mount);
                        //write(mount);
                        over = true;

                    }
                    callback(err, result);
                }
        );
    }],
        function (err, results) {//it can get only one error ,because the programe will stop if error happens; but can get serveral successful results!
            if (!err) {
                console.log("after callback mount,%s", results[0][0].mount );
                console.log("after callback mount2,%s", results[1][0].mount2 );
                console.log("how about the mount itself :%s", mount );
                client.end();
            } else {
                console.log('last errors!: ', err.message);
            }
        });
console.log("Out we have,mount %s :", mount);