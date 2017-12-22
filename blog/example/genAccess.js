var info = require('../routes/config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;
function getAlldata(res, doc) {
    console.log('getAll post data : ');
    var query = {};
    console.log('query is :' + query);
    var f = function (result) {
        res.json({
            result: result
        });
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
}

//(1)加所有为* 的 config；对应公共权限  
//（2）根据角色表，生成权限表
/**
 * 
 *   '/login': {
 'GET': true,
 'POST': true,
 },
 * @returns {undefined}
 */
function genPublicAccesses() {
    //公共权限：name; level=0,url = null.=>pid
    //children ; pid = 13; url!=null. only two level
    var allaccess = {'GET': true, 'POST': true};
    var publics = {};
    var query = {};
    var doc = 'Access';
    console.log('query is :' + query);
    var f = function (result) {
        result.forEach(function (value, index, array) {
            if (value.parentid == "11" && value.url != null) {
//                console.log('the one',value);
                publics[value.url] = allaccess;
            }
        });
        console.log(publics);
    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
}
;
//genPublicAccesses();
//拿到Acess， 获取url!=null& pid!=13 actions
//然后将 role往里面填。
function genRolesAccesses(app) {
    var allaccess = {'GET': true, 'POST': true};
    var roleacs = {};
    var roleid_rule = {};
    var query = {};
    var publics = {};
    var doc = 'Access';
//    console.log('query is :' + query);
    var m = require('../public/js/mgdb.js');
    var async = require('async');
    async.series([
        function (callback) {
            var n = new m(callback, DB_CONN_STR, 'Access');
            n.getcommonRecords(query);
        },

        function (callback) {
            var n = new m(callback, DB_CONN_STR, 'groups');
            n.getcommonRecords(query);
        }
    ],
            function (err, results) {
                if (err == null && results[0] != null) {
                    results[0].forEach(function (value, index, array) {
                        if (value.id != '11' && value.parentid != "11" && value.url != null && value.url != "") {
                            roleacs[value.url] = {'GET': [], 'POST': []};
                            roleid_rule[value.id] = value.url;
                        }
                    });
                    results[0].forEach(function (value, index, array) {
                        if (value.parentid == "11" && value.url != null) {
                            publics[value.url] = allaccess;
                        }
                    });
//                    console.log(publics);
//                    console.log(roleacs);
//                    console.log(roleid_rule);
                    if (err == null && results[1] != null) {
//                        console.log(results[1]);
                        results[1].forEach(function (value, index, array) {
                            var name = value.name;
                            var gid = value.id;
                            var permissions = value.permissions.split(',');
//                            console.log('value.permisions', permissions);
                            permissions.forEach(function (v, i, arr) {// v is the access-id
                                var url = roleid_rule[v];
                                if (url != null) {//url exists
//                                    console.log('in---urlis ', v, url, name);
                                    var index = roleacs[url].GET.indexOf(name);
//                                    console.log(roleacs[url].GET);
//                                    console.log('index is : ', index);
                                    if (index == -1) {
                                        roleacs[url].GET.push(name);
                                        roleacs[url].POST.push(name);
//                                        console.log('just put:', name, roleacs[url].GET, v);
                                    }
                                }
                            })
                        });
//                        console.log(roleacs);
                    }
                }
                var together = Object.assign({}, roleacs, publics);
//                console.log('out', together);
                app.rules = together;
                app.finished = true;//现在获取getIns就是可用的
                console.log('load ------------------finished');
            }
    );
//    console.log('outout', roleacs);//nothing
}
function appload(app) {
    genRolesAccesses(app);

}
module.exports = appload;