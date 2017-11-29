var oTable;
$(document).ready(function () {

     oTable = $("#codemngtable").dataTable({
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
function fnClickAddRow() {
    $.ajax({
        url: "/users/saveCodemng",
        data: {type: $("#type").val(), domain: $("#domain").val(), out: $("#out").val(), inner: $("#inner").val(),
            userinfo: $("#userinfo").val()},
        dataType: "text",
        type: "post",
        success: function (result) {
//            oTable.ajax.reload(null,false);
            console.log('------output success--------', result);
        },
        error: function (error) {
            console.log('------output error--------', error);
        }
    })
}