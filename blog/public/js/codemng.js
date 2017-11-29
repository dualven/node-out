
$(document).ready(function () {

    var oTable = $("#codemngtable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/codemng",
        "columns": [
            {"data": "type"},
            {"data": "domain"},
            {"data": "out_ip"},
            {"data": "inner_ip"},
            {"data": "userinfo"}
        ],

        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });

//       $("#codemngtable").$("td").editable("/users/edittable", {"callback": function (sValue, y) {
//            var aPos = oTable.fnGetPosition(this);
//            console.log('callback before', aPos, JSON.parse(sValue)['result'], aPos[0], aPos[1]);
//            oTable.fnUpdate(JSON.parse(sValue)['result'], aPos[0], aPos[1]);
//        }, "submitdata": function (value, settings) {
//            console.log('submitdata before2', value, settings);
//            return{"row_id": this.parentNode.getAttribute("id"), "column": oTable.fnGetPosition(this)[2]}
//        }, "width": "90%", "height": "100%"});
});
//   function fnClickAddRow() {
//    var oTable = $("#codemngtable").DataTable();
//    console.log('now I add row');
//    var i = [
//    "云主机",
//     "x.dualven.cn",
//    "118.18.11.11",
//    "10.60.0.0",
//     "xxx,123456"
//    ];
//    oTable.row.add(i).draw(false);
//}   