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
module.exports = router;
