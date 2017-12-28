function revokeDlg(id, name) {//编辑角色时

    console.log('yes it is begin ', id, name);
    $.ajax({
        url: "/tree/playSessions",
        data: {operator: 'set', somebody: 'group', value: id},
        dataType: "json",
        type: "post",
        success: function (result) {
            console.log(result);
//            $(".modal-body").append("<div id='app'></div> <script src='/acdist.js'></script>   ");
            $(".modal-body #app").css("display", "none");
            $("#groupid-e").val(id);
            $("#name-e").val(name);
            $(".form-group label").css("display", "block");
            $("#groupid-e").css("display", "block");
            $("#name-e").css("display", "block");
            $("#editgroup").css("display", "block");
            $("#savegroup").css("display", "none");
            $('#myModal').modal('toggle');
        }
    });

}
function accessDlg(id) {//编辑权限

    console.log('yes it is begin ', id);
    $.ajax({
        url: "/tree/playSessions",
        data: {operator: 'set', somebody: 'group', value: id},
        dataType: "json",
        type: "post",
        success: function (result) {
            console.log(result);
            $(".modal-body").append("<div id='app'></div> <script src='/acdist.js'></script>   ");
            $(".form-group label").css("display", "none");
            $("#groupid-e").css("display", "none");
            $("#name-e").css("display", "none");
            $("#savegroup").css("display", "none");
            $("#editgroup").css("display", "none");
            $('#myModal').modal('toggle');
        }
    });

}
$(function () {
    $('#myModal').on('hide.bs.modal', function () {
// alert('嘿，我听说您喜欢模态框...');
        oTable.ajax.reload();
    })
});
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
                    var name = '"' + row.name + '"';
                    var html = "<a href='javascript:void(0);'   onclick='accessDlg(" + id + ")' class='glyphicon glyphicon-pencil'> 权限编辑</a>"
//                    html += "<a href='javascript:void(0);' class='up btn btn-default btn-xs'><i class='fa fa-arrow-up'></i> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='revokeDlg(" + id + "," + name + ")' class='glyphicon glyphicon-pencil'> 角色编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='deleteThisRowPapser(" + id + ")'   class='glyphicon glyphicon-remove'> 删除</a>"
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
    $.ajax({
        url: "/tree/getMaxId",
        data: {doc: 'groups', field: 'id'},
        dataType: "json",
        type: "post",
        success: function (data) {
            var max = data.result;
            var newid = max + 1;
            $("#groupid-e").val(newid);
            $(".modal-body #app").css("display", "none");
            $(".form-group label").css("display", "block");
            $("#groupid-e").css("display", "block");
            $("#name-e").css("display", "block");
            $("#savegroup").css("display", "block");
            $("#editgroup").css("display", "none");
            $('#myModal').modal('toggle');
        }
    });
}
var btn3 = $("#savegroup");//only for create
btn3.on(
        "click", function () {
            $.ajax({
                url: "/tree/commonSave",
                data: {doc: 'groups', data: JSON.stringify({id: $("#groupid-e").val(), name: $("#name-e").val(), permissions: '1'})},
                dataType: "json",
                type: "post",
                success: function (result) {
                    console.log('------output success--------', result);
                    $("#myModal").modal('hide');
                },
                error: function (error) {
                    console.log('------output error--------', error);
                }
            })
        });

var btn4 = $("#editgroup");//only for create
btn4.on(
        "click", function () {
            $.ajax({
                url: "/tree/commonSave",
                data: {doc: 'groups', data: JSON.stringify({id: $("#groupid-e").val(), name: $("#name-e").val()})},
                dataType: "json",
                type: "post",
                success: function (result) {
                    console.log('------output success--------', result);
                    $("#myModal").modal('hide');
                },
                error: function (error) {
                    console.log('------output error--------', error);
                }
            })
        });