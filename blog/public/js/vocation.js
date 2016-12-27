$(document).ready(function(){
	
	// 请销假列表页面加载更多项效果js代码
	if(jQuery('#moreUrl').length > 0 && $('#more').length > 0){
		var url = jQuery('#moreUrl').val();
		$('#more').more({'address': url});
	}
	
	if(jQuery('#start').length > 0 && $('#end').length > 0){
		var start={elem:"#start",format:"YYYY/MM/DD hh:mm:ss",min:laydate.now(),max:"2099-06-16 23:59:59",istime:true,istoday:false,choose:function(datas){end.min=datas;end.start=datas}};
		var end={elem:"#end",format:"YYYY/MM/DD hh:mm:ss",min:laydate.now(),max:"2099-06-16 23:59:59",istime:true,istoday:false,choose:function(datas){start.max=datas}};laydate(start);laydate(end);
	}
});
