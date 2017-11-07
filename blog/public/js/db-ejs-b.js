
$(document).ready(function () {
//    $("#outputtable").dataTable();
    var oTable1 = $("#onlinetable").on('xhr.dt', function (e, settings, json, xhr) {
//        console.log("add json total is :", json.recordsTotal, json.recordsFiltered);
        var a = $('#totalhots').html('<i class="fa fa-play fa-rotate-270"></i>  ' + json.recordsTotal);

        var sub = $("#subhots").text();
        var ratio = json.recordsFiltered - sub / json.recordsTotal;
        $('#comparehots').html('<i class="fa fa-play fa-rotate-270"></i>  ' + ratio);
        $('#addhots').html('<i class="fa fa-play fa-rotate-270"></i>  ' + json.recordsFiltered);

        console.log(a);
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
        dom: 'Blfrtip',
        buttons: [{
                extend: 'excelHtml5',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    $('row c[r^="C"]', sheet).attr('s', '2');
                }
            }],
        lengthMenu: [10, 50, 500]
    });
    var oTable2 = $("#offlinetable").on('xhr.dt', function (e, settings, json, xhr) {
        $('#totalhots').html('<i class="fa fa-play fa-rotate-270"></i>  ' + json.recordsTotal);
        var add = $("#addhots").text();
        var ratio = add - json.recordsFiltered / json.recordsTotal;
        if (ratio < 0) {
            $('#comparehots').html('<i class="fa fa-play fa-rotate-90"></i>  ' + ratio);
        } else {
            $('#comparehots').html('<i class="fa fa-play fa-rotate-270"></i>  ' + ratio);
        }
        $('#subhots').html('<i class="fa fa-play fa-rotate-90"></i>   ' + json.recordsFiltered);
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
        dom: 'Blfrtip',
        buttons: [{
                extend: 'excelHtml5',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    $('row c[r^="C"]', sheet).attr('s', '2');
                }
            }],
        lengthMenu: [10, 50, 500]
// dom: "<'row'<'col-sm-6'l><'col-sm-4 'f><'col-sm-2  text-right pull-right'B>>" +
//                "<'row'<'col-sm-12'tr>>" +
//                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
//        buttons: [
//                    {
//                        extend: 'excel',
//                        text: '<span class="glyphicon glyphicon-export"></span> Export To Excel',
//                        className: 'btn btn-circle btn-default btn-sm',
//                        title: 'TQH - Resident Report'
//                    }
//        ],
    });
});