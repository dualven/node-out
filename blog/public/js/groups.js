function revokeDlg(id) {
    
    console.log('yes it is begin ',id);
    $.ajax({
        url: "/tree/playSessions",
        data: {operator: 'set', somebody: 'group', value: id},
        dataType: "json",
        type: "post",
        success: function (result) {
            console.log(result );
            $(".modal-body").append("<div id='app'></div> <script src='/acdist.js'></script>   ");
            $('#myModal').modal('toggle');
        }
    });

}
var oTable;
$(document).ready(function () {
     oTable = $("#groupsmngtable").DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": "/tree/groupsmng",
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "permissions"}
        ],
        "columnDefs": [{
                "orderable": false,
                "searchable": false,
                "targets": 3, //操作按钮目标列
                "data": null,
                "render": function (data, type, row) {
                    var id = '"' + row.id + '"';
                    var html = "<a href='javascript:void(0);'  class='delete btn btn-default btn-xs'  ><i class='fa fa-times'></i> 查看</a>"
//                    html += "<a href='javascript:void(0);' class='up btn btn-default btn-xs'><i class='fa fa-arrow-up'></i> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='revokeDlg(" + id + ")'  class='up btn btn-default btn-xs'><i class='fa fa-arrow-down'></i> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='deleteThisRowPapser(" + id + ")'  class='down btn btn-default btn-xs'><i class='fa fa-arrow-down'></i> 删除</a>"
                    return html;
                }
            }],
        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });
}
);
function deleteThisRowPapser(id) {
    $.ajax({
        url: "/tree/deleteOneId",
        data: {doc: 'groups', id: id},
        dataType: "json",
        type: "post",
        success: function (data) {
            console.log(data);
             oTable.ajax.reload();
        }
    }
    );
}
function fnClickAddRow() {
      $('#myModal').modal('toggle');
}
var btn3 = $("#savegroup");
btn3.on(
        "click", function () {
            $.ajax({
                url: "/tree/commonSave",
                data: {doc:'groups',data:JSON.stringify({id: $("#groupid-e").val(), name: $("#name-e").val(),permissions:'1'})},
                dataType: "json",
                type: "post",
                success: function (result) {
                    console.log('------output success--------', result);
                    oTable.ajax.reload();
                    $("#myModal").modal('hide');
                },
                error: function (error) {
                    console.log('------output error--------', error);
                }
            })
        });