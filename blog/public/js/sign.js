$(document).ready(function(){

    $('.btn-alert').click(function(){
        var href  =  $(this).attr('href');
        swal({
            title: "您确定要签到吗",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "签到",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },function(){
            window.location.href=href;
        });
        return false;
    });

    $('.btn-alert2').click(function(){
        var href  =  $(this).attr('href');
        swal({
            title: "您确定要删除吗",
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



});