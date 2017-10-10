
$(document).ready(function () {
//    $("#outputtable").dataTable();
    var oTable = $("#outputtable2").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/users/process",
        "columns": [
            {"data": "dbinfo"},
            {"data": "start"},
            {"data": "end"},
            {"data": "note"},
            {"data": "code"}
        ]
    });
    oTable.$("td").editable("/users/edittable", {"callback": function (sValue, y) {
            var aPos = oTable.fnGetPosition(this);
            console.log('callback before', aPos, JSON.parse(sValue)['result'], aPos[0], aPos[1]);
            oTable.fnUpdate(JSON.parse(sValue)['result'], aPos[0], aPos[1]);
        }, "submitdata": function (value, settings) {
            console.log('submitdata before2', value, settings);
            return{"row_id": this.parentNode.getAttribute("id"), "column": oTable.fnGetPosition(this)[2]}
        }, "width": "90%", "height": "100%"})
});
function fnClickAddRow() {
    $("#outputtable").dataTable().fnAddData(["Custom row", "New row", "New row", "New row", "New row"]);
    var oTable = $("#outputtable").dataTable();
    oTable.$("td").editable("/users/edittable", {"callback": function (sValue, y) {
            var aPos = oTable.fnGetPosition(this);
            console.log('callback before', aPos, sValue, aPos[0], aPos[1]);
            oTable.fnUpdate(JSON.parse(sValue)['result'], aPos[0], aPos[1]);
        }, "submitdata": function (value, settings) {
            console.log('submitdata before2', value, settings);
            return{"row_id": this.parentNode.getAttribute("id"), "column": oTable.fnGetPosition(this)[2]}
        }, "width": "90%", "height": "100%"})
}
;