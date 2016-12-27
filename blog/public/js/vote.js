$(document).ready(function(){
	// 后台投票结果界面的js效果代码,前台先也用这个吧
	jQuery('.skillbar').each(function(){
		jQuery(this).find('.skillbar-bar').animate({
			width:jQuery(this).attr('data-percent')
		},3000);
	});
	
	// 前台投票项列表页面加载更多项效果js代码
	if(jQuery('#moreUrl').length > 0 && $('#more').length > 0){
		var url = jQuery('#moreUrl').val();
		$('#more').more({'address': url});
	}
	
	// 投票项列表界面弹窗显示 2016-07-28
    $(".isVoteJs").on('click', function(){
		swal({title:"",text:"您已经投过票了!"});
	});
});
