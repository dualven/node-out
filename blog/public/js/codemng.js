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
        "columnDefs": [{
                "orderable": false,
                "searchable": false,
                "targets": 5, //操作按钮目标列
                "data": null,
                "render": function (data, type, row) {
                    var type = '"' + row.type + '"';
                    var domain = '"' + row.domain + '"';
                    var out_ip = '"' + row.out_ip + '"';
                    var inner_ip = '"' + row.inner_ip + '"';
                    var userinfo = '"' + row.userinfo + '"';
                    var html = ""
                    html += "<a href='javascript:void(0);'   onclick='revokeDlg(" + type + "," + domain + "," + out_ip + "," + inner_ip + "," + userinfo + ")'  class='glyphicon glyphicon-pencil'> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='deleteThisRowPapser(" + type + "," + userinfo + ")'  class='glyphicon glyphicon-remove'> 删除</a>"
                    return html;
                }
            }],
        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });

});
$(function () {
    $('#myModal').on('hide.bs.modal', function () {
// alert('嘿，我听说您喜欢模态框...');
        oTable.api().ajax.reload();
    })
});
function revokeDlg(type, domain, out_ip, inner_ip, userinfo) {
    $("#type-old").val(type);
    $("#domain-old").val(domain);
    $("#out_ip-old").val(out_ip);
    $("#inner_ip-old").val(inner_ip);
    $("#userinfo-old").val(userinfo);
     $("#type-e").val(type);
    $("#domain-e").val(domain);
    $("#out_ip-e").val(out_ip);
    $("#inner_ip-e").val(inner_ip);
    $("#userinfo-e").val(userinfo);
    $('#myModal').modal('toggle');
}
var btn4 = $("#editgroup");//only for create
btn4.on(
        "click", function () {
            $.ajax({
                url: "/tree/commonSaveEx",
                data: {doc: 'codemng', 
                    updatestr: JSON.stringify({type: $("#type-e").val(), domain: $("#domain-e").val(), out_ip: $("#out_ip-e").val(), inner_ip: $("#inner_ip-e").val(), userinfo: $("#userinfo-e").val()})
                ,old: JSON.stringify({type: $("#type-old").val(), domain: $("#domain-old").val(), out_ip: $("#out_ip-old").val(), inner_ip: $("#inner_ip-old").val(), userinfo: $("#userinfo-old").val()})},
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
function deleteThisRowPapser(type, userinfo) {
    $.ajax({
        url: "/tree/deleteOneId",
        data: {doc: 'codemng', type: type, userinfo: userinfo},
        dataType: "json",
        type: "post",
        success: function (data) {
            console.log(data);
            oTable.api().ajax.reload();
        }
    }
    );
}
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
            alert(' 添加成功！');
            oTable.api().ajax.reload();
        },
        error: function (error) {
            console.log('------output error--------', error);
        }
    })
}