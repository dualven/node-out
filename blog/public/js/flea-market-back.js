function $childNode(o) {
    return window.frames[o]
}
function animationHover(o, e) {
    o = $(o),
    o.hover(function() {
        o.addClass("animated " + e)
    },
    function() {
        window.setTimeout(function() {
            o.removeClass("animated " + e)
        },
        2e3)
    })
}
function WinMove() {
    var o = "[class*=col]",
    e = ".ibox-title",
    i = "[class*=col]";
    $(o).sortable({
        handle: e,
        connectWith: i,
        tolerance: "pointer",
        forcePlaceholderSize: !0,
        opacity: .8
    }).disableSelection()
}
var $parentNode = window.parent.document;
if ($(".tooltip-demo").tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
}), $(".modal").appendTo("body"), $("[data-toggle=popover]").popover(), $(".collapse-link").click(function() {
    var o = $(this).closest("div.ibox"),
    e = $(this).find("i"),
    i = o.find("div.ibox-content");
    i.slideToggle(200),
    e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),
    o.toggleClass("").toggleClass("border-bottom"),
    setTimeout(function() {
        o.resize(),
        o.find("[id^=map-]").resize()
    },
    50)
}), $(".close-link").click(function() {
    var o = $(this).closest("div.ibox");
    o.remove()
}), top == this) {
	    if ($('.fleaindexurl').length > 0) {
		var gohome = '<div class="gohome"><a class="animated bounceInUp" title="返回首页"><i class="fa fa-home"></i></a></div>';
		$("body").append(gohome);
		$('.gohome').click(function() {
			window.location.href = $('.fleaindexurl').val();
			return false;
		});
	}
}

jQuery(function() {
	
	$("#fleareplaybutton").click(function(){
		if($("#input_message").val() == ""){
			alert("请填写消息内容哦！");
			return false;
		}
		if($("#input_message").val().length > 100){
			alert("消息内容长度不要超过100哦！");
			return false;
		}
	});
	
	//求购表单的验证
	 $("#addneedbutton").click(function(){
		 if($("#addflea_name").val()==null||$("#addflea_name").val()==""){
			 alert("商品名称不能为空哦");
			 return false;
		 }
		 
		 if($("#ccomment").val()==""){
			 alert("商品详情不能为空哦");
			 return false;
		 }
		 
		 if($("#addflea_location").val()==null||$("#addflea_location").val()==""){
			 alert("交易地点不能为空哦");
			 return false;
		 }
		 if($("#addflea_prices").val()==null||$("#addflea_prices").val()==""){
			 alert("价格指标要写哦");
			 return false;
		 }
		 //价格格式校验
		 s = $("#addflea_prices").val().trim();
		 var p =/^\d+(\.\d{1,2})?$/;
		 if(!p.test(s)){
			 alert("价格指标格式不正确哦");
			 return false;
		 }
		
		 if(($("#addflea_phone").val()==null||$("#addflea_phone").val()=="")&&($("#addflea_email").val()==null||$("#addflea_email").val()=="")){
			 alert("联系方式不能全部为空，至少写一个哦");
			 return false;
		 }
		 
		 //手机号格式校验
		 if(($("#addflea_phone").val()!="") && !$("#addflea_phone").val().match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)){
			 alert("手机号格式不正确");
			 return false;
		 }
		 
		 //邮箱格式校验
		 if (($("#addflea_email").val()!="") && (!$("#addflea_email").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/))){
			 alert("邮箱格式不正确");
			 return false;
		 }
			 
	 });
	 
	 //防止新增商品表单重复提交
	 $("#addneedform").submit(function(){
		 $("#addfleabutton").attr('disabled', 'disabled');
	 });
	
});

