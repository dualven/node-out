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
                    var userinfo = '"' + row.userinfo + '"';
                    var html = ""
                    html += "<a href='javascript:void(0);'   onclick='deleteThisRowPapser(" + type+","+ userinfo + ")'  class='down btn btn-default btn-xs'><i class='fa fa-arrow-down'></i> 删除</a>"
                    return html;
                }
            }],
        dom: 'lfrtip',
        lengthMenu: [10, 50, 500]
    });

});
function deleteThisRowPapser(type,userinfo) {
    $.ajax({
        url: "/tree/deleteOneId",
        data: {doc: 'codemng', type: type,userinfo:userinfo},
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