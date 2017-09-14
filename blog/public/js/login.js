$(document).ready(function(){
	function shake(){
	    var $panel = $("#sway");
	    box_left = ($(window).width() -  $panel.width()) / 2;
	    $panel.css({'left': box_left,'position':'absolute'});
	    for(var i=1; 4>=i; i++){
	        $panel.animate({left:box_left-(40-10*i)},100);
	        $panel.animate({left:box_left+2*(40-10*i)},100);
	    }
	}
	
	jQuery('#eduLogin').click(function(){
			var loginUrl = jQuery("#loginUrl").val();
			// 1.判断是否为空
			var username = jQuery('#account').val();
			var password = jQuery('#password').val();
			//username
			if(jQuery.trim(username) == ""){
				shake();
				$("#name-tips").show().html("* 请填写用户名");
				$("#account").addClass("error");
				return;
			}else{
				$("#name-tips").show().html("");
				$("#account").removeClass("error");
			}
			//password
			if(jQuery.trim(password) == ""){
				shake();
				$("#pwd-tips").show().html("* 请填写密码");
				$("#password").addClass("error");
				return;
			}else{
				$("#pwd-tips").show().html("");
				$("#password").removeClass("error");
			}
			
			// 2.判断用户名是否存在
			// 3.判断密码是否正确
			$.ajax({
				url:"/login/check",
				dateType:'json',
				type: 'post',
				data:{username:username,password:password},
				success:function(data){                         
					if(data.status == 1){
						shake();	
						$("#account").addClass("error");
						$("#name-tips").show().html(data.msg);
					}
					else if(data.status == 2){
						shake();
						$("#password").addClass("error");
						$("#pwd-tips").show().html(data.msg);
					}
					else if(data.status == 3){
						shake();	
						$("#account").addClass("error");
						$("#name-tips").show().html(data.msg);
					}
					else if(data.status == 4){
						shake();
						$("#password").addClass("error");
						$("#pwd-tips").show().html(data.msg);
					}
					else{
						window.location.href=loginUrl+"/index.php/index/index";
					}
				},
				error:function(e){
					alert("用户名或密码不正确");
				}
			});
		});
});
