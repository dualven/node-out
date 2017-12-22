var info = require('../routes/config');
var DB_CONN_STR = info.mongodbInfo.DB_CONN_STR;
function getMenu() {
    var query = {'level': {'$in': ["0", "1"]}};
    var publics = [];
    var doc = 'Access';
    console.log('query is :' + query);
    var f = function (result) {
        result.forEach(function (value, index, array) {
            if (value.level == '0' && value.id != '11' && value.parentid != '11') {
                publics[value.id] = {};
                publics[value.id].name = value.name;
                publics[value.id]._data = [];

            }
        });
        result.forEach(function (value, index, array) {
            if (value.level == '1' && value.id != '11' && value.parentid != '11' && value.url != null) {
                console.log('now it is :', value.name, value.id);
                if (publics[value.parentid]._data == null) {
                    publics[value.parentid]._data = [];
                }

                publics[value.parentid]._data[value.id] = {};
                publics[value.parentid]._data[value.id].name = value.name;
                publics[value.parentid]._data[value.id].mca = value.url;
            }
        });
        console.log(publics.length, publics);
        delete publics[0];
        console.log(publics.length, publics);
        publics.forEach(
                function (value, index, array) {
                    console.log(value.name, value._data,index);
                }
        );

    };
    var m = require('../public/js/mgdb.js');
    var n = new m(f, DB_CONN_STR, doc);
    n.getIPRecords(query);
}
getMenu();