
$(document).ready(function () {
//    $("#outputtable").dataTable();
    var oTable1 = $("#onlinetable").on('xhr.dt', function (e, settings, json, xhr) {
        for (var i = 0, ien = json.data.length; i < ien; i++) {
            json.data[i].customer_name = json.data[i].customer.customer_name;
            json.data[i].onlinetime = new Date(json.data[i].onlinetime * 1000).toLocaleString();
        }
        // Note no return - manipulate the data directly in the JSON object.
    }).dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/onlinehots",
        "columns": [
            {"data": "gw_id"},
            {"data": "gw_name"},
            {"data": "street"},
            {"data": "onlinetime"},
            {"data": "customer_id"},
            {"data": "customer_name"},
            {"data": "created_at_time"}
        ],

    });
    var oTable2 = $("#offlinetable").on('xhr.dt', function (e, settings, json, xhr) {
        for (var i = 0, ien = json.data.length; i < ien; i++) {
            json.data[i].customer_name = json.data[i].customer.customer_name;
            json.data[i].offlinetime = new Date(json.data[i].offlinetime * 1000).toLocaleString();
//            var unixTimestamp = new Date(Unix timestamp * 1000) 然后 commonTime = unixTimestamp.toLocaleString()
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
            {"data": "customer_name"},
            {"data": "created_at"}
        ],
         dom: 'Bfrtip',
        buttons: [ {
            extend: 'excelHtml5',
            customize: function( xlsx ) {
                var sheet = xlsx.xl.worksheets['sheet1.xml'];
 
                $('row c[r^="C"]', sheet).attr( 's', '2' );
            }
        } ]
    });
});