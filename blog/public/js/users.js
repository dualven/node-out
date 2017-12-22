function revokeDlg(id, groupid, name, pwd, sex) {
    $("#userid-e").val(id);
    $("#groupid-e").val(groupid);
    $("#name-e").val(name);
    $("#pwd-e").val(pwd);
    $("#sex-e").val(sex);

    $.ajax({
        url: "/tree/getCommonTb",
        data: {table: 'groups'},
        dataType: "json",
        type: "post",
        success: function (data) {
            var result = data.result;
            console.log(result);

            var columns = [];
            result.forEach(function (value, index, array) {
                columns[value.id] = value.name;
            });
            addColumns(columns, groupid);
            $('#myModal').modal('toggle');
        }
    });

}
var btn3 = $("#saveuser");
btn3.on(
        "click", function () {
            $.ajax({
                url: "/tree/updateUser",
                data: {id: $("#userid-e").val(), groupid: $("input[name='roleradios']:checked").val(), name: $("#name-e").val(), password: $("#pwd-e").val(), sex: $("#sex-e").val()},
                dataType: "json",
                type: "post",
                success: function (result) {
                    console.log('------output success--------', result);
                },
                error: function (error) {
                    console.log('------output error--------', error);
                }
            })
        });
function addColumns(columns, init) {
    var b = $("#rolegroup");
    $("#rolegroup label ").remove();
//    for (var i = 0; i < columns.length; i++) {
//        b.append('<label><input type="radio" checked="false" value="' + columns[i] + '" name="roleradios">' + columns[i] + '</label>');
//    }
    columns.forEach(function (value, index, array) {
        b.append('<label><input type="radio" checked="false" value="' + index + '" name="roleradios">' + value + '--' + index + '</label>');
    });
    var a = $("input:radio[name=roleradios][value=" + init + "]");
    a.click();

}
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
                    var groupid = '"' + row.groupid + '"';
                    var name = '"' + row.name + '"';
                    var pwd = '"' + row.password + '"';
                    var sex = '"' + row.sex + '"';
                    var html = "<a href='javascript:void(0);'  class='delete btn btn-default btn-xs'  ><i class='fa fa-times'></i> 查看</a>"
                    html += "<a href='javascript:void(0);'   onclick='revokeDlg(" + id + "," + groupid + "," + name + "," + pwd + "," + sex + ")'  class='up btn btn-default btn-xs'><i class='fa fa-arrow-down'></i> 编辑</a>"
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
        data: {doc: 'users', id: id},
        dataType: "json",
        type: "post",
        success: function (data) {
            console.log(data);
        }
    }
    );
}
function fnClickAddRow() {
//    $.ajax({
//        url: "/tree/commonSaveuser",
//        data: {id: $("#id").val(), name: $("#name").val(), sex: $("#sex").val(), groupid: $("#groupid").val()},
//        dataType: "text",
//        type: "post",
//        success: function (result) {
////            oTable.ajax.reload(null,false);
//            console.log('------output success--------', result);
//        },
//        error: function (error) {
//            console.log('------output error--------', error);
//        }
//    })
    $.ajax({
        url: "/tree/getCommonTb",
        data: {table: 'groups'},
        dataType: "json",
        type: "post",
        success: function (data) {
            var result = data.result;
            console.log(result);

            var columns = [];
            result.forEach(function (value, index, array) {
                columns[value.id] = value.name;
            });
            addColumns(columns, 1);
            $('#myModal').modal('toggle');
        }
    });
}