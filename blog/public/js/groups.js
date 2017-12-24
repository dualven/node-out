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
$(document).ready(function () {
    var oTable = $("#groupsmngtable").dataTable({
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

function fnClickAddRow() {
      $('#myModal').modal('toggle');
}
var btn3 = $("#savegroup");
btn3.on(
        "click", function () {
            $.ajax({
                url: "/tree/commonSave",
                data: {doc:'groups',data:JSON.stringify({id: $("#groupid-e").val(), name: $("#name-e").val(),permissions: $("#permissions-e").val()})},
                dataType: "json",
                type: "post",
                success: function (result) {
                    console.log('------output success--------', result);
                    $("#myModal").modal('hidden');
                },
                error: function (error) {
                    console.log('------output error--------', error);
                }
            })
        });