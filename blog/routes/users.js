var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.all('/suggest', function (req, res, next) {
    console.log('suggest post data : '  );
    console.log(req.param('query'));
     var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'dbinfo';
    var query = {"db-ip": new RegExp("^.*"+req.param('query')+".*$")};
    console.log('query is :'+query);
    var f = function (result) {
        console.log(JSON.stringify(result));
//        console.log('so result:' + result[0]['db-ip'])
        res.json({
            result: result
        });
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
// res.json({"result":[["127","dxw"],["28","dxw2"]]});
});
router.all('/edittable', function (req, res, next) {
    console.log('edittable post data : '  );
    console.log(req.param('value'));
 res.json({"result":req.param('value')});
});

router.all('/saveOpers', function (req, res, next) {
    var DB_CONN_STR = 'mongodb://localhost:27017/dualven';
    var doc = 'operslog';
    console.log('dbinfo post data : ' + req.body.user + "---" + req.body.pwd + "---" + req.body.ip + "---" + req.body.port);
    //test db
    var f = function (result) {
        res.json(result);
    }
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    var where = {"dbinfo":"gwifi-think_user_access-login_time","oper_time":new Date().format('yyyyMMddhhmmss'),"start":new Date().format('yyyyMMddhhmmss'),"end":new Date().format('yyyyMMdd'),"note":"error or ","code":"pass or nopass"};
    n.saveOpers(where);
});
module.exports = router;
