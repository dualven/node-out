var oTable;
$(document).ready(function () {

     oTable = $("#usersmngtable").dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/tree/usersmng",
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "sex"},
            {"data": "groupid"}
        ],

        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });

});
function fnClickAddRow() {
    $.ajax({
        url: "/tree/commonSaveuser",
        data: {id: $("#id").val(), name: $("#name").val(), sex: $("#sex").val(), groupid: $("#groupid").val()},
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