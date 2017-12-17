var oTable;
$(document).ready(function () {

     oTable = $("#groupsmngtable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/tree/groupsmng",
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "permissions"}
        ],

        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });

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