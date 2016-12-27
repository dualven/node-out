jQuery(function() {
	 var gohome = '<div id="previewtest" style="position:absolute;top:25%;right:0px;width:50px;height:50px;line-height:50px;text-align:center;z-index:100;background:#fc9f15;border-radius:50px;"><a class="preview">预览<a></div>';
	
     //var gohome = '<div id="testtesttest" style="background-color:#CCCCCC;font-size:0;draggable:true;border-radius:50px; width:100px;height:100px;position:absolute;z-index:100;"></div>';
	 $("body").append(gohome);
	// rDrag.init($('#testtesttest'));
	 
	 var dragging = false;
	 var iX, iY;
	 $("#previewtest").mousedown(function(e) {
	 dragging = true;
	 iX = e.clientX - this.offsetLeft;
	 iY = e.clientY - this.offsetTop;
	 this.setCapture && this.setCapture();
	 return false;
	 });
	 document.onmousemove = function(e) {
	 if (dragging) {
	 var e = e || window.event;
	 var oX = e.clientX - iX;
	 var oY = e.clientY - iY;
	 $("#previewtest").css({"left":oX + "px", "top":oY + "px"});
	 return false;
	 }
	 };
	 $(document).mouseup(function(e) {
	 dragging = false;
	 $("#previewtest")[0].releaseCapture();
	 e.cancelBubble = true;
	 }) 
	 $('.preview').click(function(){
		 var hreftext  =  $(this).attr('href');
		 var codeurl="http://qr.topscan.com/api.php?text="+$('.request_hidden_url').val();
		 window.open(codeurl);
		 return false;
	 });
	 var system ={win : false,mac : false,xll : false};
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	// 跳转语句
	if (system.win || system.mac || system.xll) {
		// nothing to do
	} else {
		$('#previewtest').hide();
	}	 
});