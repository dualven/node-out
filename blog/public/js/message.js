/**
 * message.js
 * 校长信箱 - 写信/回复
 * @author zhupengfei 2016/7/20
 * 
 */

/**
 * 设置与取消设置热点消息
 * 
 */
function sethot(){
    if($('input[name="ishot"]').val() == 1){
        document.getElementById('hotpotlabel').style.visibility = "hidden";
        document.getElementById('hotpot').style.backgroundImage = "url('../../../../Public/image/star2.png')";
        $('input[name="ishot"]').val('0');
    }else{
        document.getElementById('hotpotlabel').style.visibility = "visible";
        document.getElementById('hotpot').style.backgroundImage = "url('../../../../Public/image/star1.png')";
        $('input[name="ishot"]').val('1');
    }
}

/**
 * 删除消息
 * 
 */
$(document).ready(function(){

    $('.btn-alert').click(function(){
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

jQuery(function() {
	//消息表单验证
	$("#sendmessagebtn").click(function(){
		
		if($("#titles").val() == ""){
			alert("主题要写哦");
			return false;
		}
		if($("#contents").val() == ""){
			alert("内容要写哦");
			return false;
		}
		
	});
});

