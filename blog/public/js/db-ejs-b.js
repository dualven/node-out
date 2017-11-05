
$(document).ready(function () {
//    $("#outputtable").dataTable();
    var oTable1 = $("#onlinetable").on('xhr.dt', function (e, settings, json, xhr) {
        for (var i = 0, ien = json.data.length; i < ien; i++) {
            json.data[i].customer_name = json.data[i].customer.customer_name;
        }
        // Note no return - manipulate the data directly in the JSON object.
    }).dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/onlinehots",
        "columns": [
//            {"data": "name"},
//            {"data": "age"},
//            {"data": "weight"},
//            {"data": "height"},
//            {"data": "createdAt"},
//            {"data": "updatedAt"}
            {"data": "gw_id"},
            {"data": "gw_name"},
            {"data": "street"},
            {"data": "onlinetime"},
            {"data": "customer_id"},
            {"data": "customer_name"}
        ],

    });
    var oTable2 = $("#offlinetable").on('xhr.dt', function (e, settings, json, xhr) {
        for (var i = 0, ien = json.data.length; i < ien; i++) {
            json.data[i].customer_name = json.data[i].customer.customer_name;
        }
        // Note no return - manipulate the data directly in the JSON object.
    }).dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/offlinehots",
        "columns": [
           {"data": "gw_id"},
            {"data": "gw_name"},
            {"data": "street"},
            {"data": "offlinetime"},
            {"data": "customer_id"},
            {"data": "customer_name"}
        ]
    });
});