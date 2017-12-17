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
        "columnDefs": [{
                "orderable": false,
                "searchable": false,
                "targets": 4, //操作按钮目标列
                "data": null,
                "render": function (data, type, row) {
                    var id = '"' + row.id + '"';
                    var html = "<a href='javascript:void(0);'  class='delete btn btn-default btn-xs'  ><i class='fa fa-times'></i> 查看</a>"
                    html += "<a href='javascript:void(0);' class='up btn btn-default btn-xs'><i class='fa fa-arrow-up'></i> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='deleteThisRowPapser(" + id + ")'  class='down btn btn-default btn-xs'><i class='fa fa-arrow-down'></i> 删除</a>"
                    return html;
                }
            }],

        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });
}
);
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