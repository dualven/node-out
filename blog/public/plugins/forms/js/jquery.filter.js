$(function() {
	/**筛选**/
	/*进入筛选*/
	$("#headerFiltrate").click(function() {
		$("#header").hide();
		$("#filtratePage").show();
		//主体隐藏
		$("#entity").hide();
		//按钮组隐藏
		$("#buttongroup").hide();
	});
	/*选择分类*/
	var classifyHeight, classifyListHeight, classify = $(".filtrate-classify-list li.active>a").html();

	/*选择其他条件*/
	$(".filtrate-other li label").click(function() {
		var otherLi = $(this).parent("li");
		var itself = $(this);
		var conditionState = otherLi.hasClass("active");
		if (conditionState == true) {
			otherLi.removeClass("active");
			itself.removeClass("mark");
		} else {
			otherLi.addClass("active");
			itself.addClass("mark");
		}
	});
	
	
	/*清空筛选条件*/
	$(".filtrate-reset").click(function() {
		/*清空分类*/
		$("#classify").removeClass("show");
		$("#classify a span").html("展开");
		classify = $(".filtrate-classify-list li.active>a").html();
		$(".filtrate-classify-list li").removeClass("active");
		$(".filtrate-classify-list>li").addClass("active");
		$(".filtrate-classify-list li ul li ul").hide();
		/*收起分类*/
		classifyHeight = parseInt($(".filtrate-classify").css("height"));	
		if (classifyHeight > 0) {
			$(".filtrate-classify").animate({height: 0});
		}
		/*清空价格*/
		$("#minPrice, #maxPrice").val("");
		/*清空收货地*/
		$("#address").removeClass("show");
		$("#address a span").html("展开");
		address = "";
		/*收起收货地*/
		var addressBoxHeight = parseInt($(".filtrate-address ul").css("height"));
		if (addressBoxHeight > 0) {
			$(".filtrate-address").animate({height: 0});
		}
		/*清空已选收货地*/
		$(".filtrate-address ul li").removeClass("active");
		/*清空其他选项*/
		$(".filtrate-other ul li").removeClass("active");
	});
	
	/*从筛选返回主体页面*/
	$("#filtrateBackContains, .filtrate-submit").click(function() {
		var all  =  $(".mark");
		var result  =   '';
		
		var result_category  =   '';
		var result_class  =   '';
		var result_status  =   '';
		var result_date  =   '';
		
		  $.each(all, function(i,val){
					  if($(this).attr('data-info') <7){
						  if(result_category==''){
							  result_category = $(this).attr('data-info') ;
						  }else{
							  result_category = result_category+","+$(this).attr('data-info');
						  }
					  }else if($(this).attr('data-info') <9){
						  if(result_class==''){
							  result_class = $(this).attr('data-info') ;
						  }else{
							  result_class = result_class+","+$(this).attr('data-info');
						  }
					  }else if($(this).attr('data-info') <11){
						  
						  if(result_status==''){
							  result_status = $(this).attr('data-info') ;
						  }else{
							  result_status = result_status+","+$(this).attr('data-info');
						  }
						  
					  }else{
						  if(result_date==''){
							  result_date = $(this).attr('data-info') ;
						  }else{
							  result_date = result_date+","+$(this).attr('data-info');
						  }
					  }
		  });   

		  result=result_category+result_class+result_status+result_date;
		  //获取数据
		  if(result ==''){
				$("#header").show();
				$("#filtratePage").hide();
				//主体隐藏
				$("#entity").show();
				//按钮组隐藏
				$("#buttongroup").show();
		  }else{
			  window.location='index?tag=true&category='+result_category+"&class="+result_class+"&status="+result_status+"&date="+result_date;
		  }
	
		
		
	
	});
});