
$(document).ready(function () {
//    $("#outputtable").dataTable();
    var oTable1 = $("#onlinetable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/onlinehots",
        "columns": [
            {"data": "name"},
            {"data": "age"},
            {"data": "weight"},
            {"data": "height"},
            {"data": "createdAt"},
            {"data": "updatedAt"}
//             {"data": "gw_id"},
//            {"data": "gw_name"},
//            {"data": "street"},
//            {"data": "onlinetime"},
//            {"data": "customer_id"},
//            {"data": "customer_name"}
        ]
    });
    var oTable2 = $("#offlinetable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/offlinehots",
        "columns": [
            {"data": "gw_id"},
            {"data": "name"},
            {"data": "street_address"},
            {"data": "last_heartbeat_at"},
            {"data": "customer_id"},
            {"data": "local_name"}
        ]
    });
});