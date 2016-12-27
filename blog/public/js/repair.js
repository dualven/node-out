$(document).ready(function(){

    $('.btn-alert').click(function(){
        var href  =  $(this).attr('href');
        swal({
            title: "您确定要取消吗",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "取消",
            confirmButtonText: "确认",
            closeOnConfirm: false
        },function(){
            window.location.href=href;
        });
        return false;
    });

    // 前台投票项列表页面加载更多项效果js代码
    if(jQuery('#moreUrl').length > 0 && $('#more').length > 0){
        var url = jQuery('#moreUrl').val();
        var studentname = $("#studentname").val();
        var phone = $("#phone").val();
        var datetime = $("#datetime").val();

        $('#more').more({'address': url,'studentname':studentname,'phone':phone,'datetime':datetime});
    }

});


function add(){
    $("input[name='studentname'],input[name='phone'],input[name='product_type'],input[name='fault_type']").val('');
    //$("input[name='pid']").val(0);
    $("#menuform").attr("action", "insert");
    $('#modal-form').modal('show');
}

// 添加子菜单
function add_child(obj){
    var navId=$(obj).attr('navId');
    $("input[name='pid']").val(navId);
    $("input[name='name']").val('');
    $("input[name='mca']").val('');
    $("#menuform").attr("action", "add.html");
    $('#modal-form').modal('show');
}

// 修改报修单
function edit(obj){
    var navId=$(obj).attr('navId');
    var navName=$(obj).attr('navName');
    var navMca=$(obj).attr('navMca');
    var navIco=$(obj).attr('navIco');
    var navFault=$(obj).attr('navFault');
    $("input[name='id']").val(navId);
    $("input[name='studentname']").val(navName);
    $("input[name='phone']").val(navMca);
    $("select[name='product_type']").val(navIco);
    $("input[name='fault_type']").val(navFault);
    $("#menuform").attr("action", "edit");
    $('#modal-form').modal('show');
}