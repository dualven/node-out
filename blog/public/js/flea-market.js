jQuery(function() {
	$('.fleapersonalcenter_span2href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要删除这条信息吗",
			 text:"删除后将无法恢复，请谨慎操作！",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"删除",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="fleapersonalcenter";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.fleapersonalcenter_span1href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要把商品状态改为已售出吗",
			 text:"已售出的商品不会被他人看到,一旦修改之后就无法修改,是否继续？",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"继续",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="fleapersonalcenter";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.fleapersonalcenter_span3href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要把商品下架吗",
			 text:"已下架的商品不会被他人看到,是否继续？",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"继续",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="fleapersonalcenter";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.mybuyzone_span2href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要删除这条信息吗",
			 text:"删除后将无法恢复，请谨慎操作！",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"删除",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="mybuyzone";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.mybuyzone_span1href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要把商品状态改为已售出吗",
			 text:"已售出的商品不会被他人看到,一旦修改之后就无法修改,是否继续？",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"继续",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="mybuyzone";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.mybuyzone_span3href').click(function(){
		 var href  =  $(this).attr('href');
		 swal({
			 title:"您确定要把商品下架吗",
			 text:"已下架的商品不会被他人看到,是否继续？",
			 type:"warning",
			 showCancelButton:true,
			 confirmButtonColor:"#fc575d",
			 confirmButtonText:"继续",
	    	 closeOnConfirm:true},function(){
	    		 $.ajax({
	    	           type: "post",
	    	           url: href,
	    	           dataType: "json",
	    	           success: function (data) {
	    	                  window.location.href="mybuyzone";
	    	             },
	    	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	    	            	  console.log(XMLHttpRequest);
	    	            	  alert(XMLHttpRequest);
	    	                  alert(errorThrown);
	    	            }
	    	     });
	    		 }
	    	 ); 
		 return false;
	 });
	 $('.collection_cancle-a').click(function(){
		 var href  =  $(this).attr('href');
		 $.ajax({
	           type: "post",
	           url: href,
	           dataType: "json",
	           success: function (data) {
	                  window.location.href="collection";
	             },
	              error: function (XMLHttpRequest, textStatus, errorThrown) {
	            	  console.log(XMLHttpRequest);
	            	  alert(XMLHttpRequest);
	                  alert(errorThrown);
	            }
	     });
	   
		 return false;
	 });
	 
	 $("#addfleabutton").click(function(){
		 if($("#addflea_name").val()==null||$("#addflea_name").val()==""){
			 alert("商品名称不能为空哦");
			 return false;
		 }
		 
		 if($("#addflea_details").val()==""){
			 alert("商品详情不能为空哦");
			 return false;
		 }
		 
		 if($("#addflea_location").val()==null||$("#addflea_location").val()==""){
			 alert("交易地点不能为空哦");
			 return false;
		 }
		 if($("#addflea_prices").val()==null||$("#addflea_prices").val()==""){
			 alert("价格要写哦");
			 return false;
		 }
		 //价格格式校验
		 s = $("#addflea_prices").val().trim();
		 var p =/^\d+(\.\d{1,2})?$/;
		 if(!p.test(s)){
			 alert("价格格式不正确哦");
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
	 $("#addfleasubmit,#editneedform").submit(function(){
		 $("#addfleabutton").attr('disabled', 'disabled');
	 });	 
	 
	 
});