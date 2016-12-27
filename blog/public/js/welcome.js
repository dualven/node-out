/**
 * message.js
 * 校园迎新
 * @author zhupengfei 2016/7/20
 * 
 */

/**
 * 地图拖拽
 * @param obj
 * @param e
 */
function drag(obj,e){
    var e=e ? e : event;
	var mouse_left=e.clientX-obj.offsetLeft;
	var mouse_top=e.clientY-obj.offsetTop;
	var docmousemove=document.onmousemove;
	var docmouseup=document.onmouseup;
	document.onselectstart=function(e){return false}
	document.onmouseup=function(){
        document.onmousemove=docmousemove;
        document.onmouseup=docmouseup;
        document.onselectstart=function(e){return true}
    }
	document.onmousemove=function(ev){
	    var ev=ev ? ev : event;
		if(ev.clientX-mouse_left>0&&document.documentElement.clientWidth-(ev.clientX-mouse_left)-obj.offsetWidth+document.documentElement.scrollLeft>0){
            obj.style.left=(ev.clientX-mouse_left)+"px";
		}
		if(ev.clientY-mouse_top>0&&document.documentElement.clientHeight-(ev.clientY-mouse_top)-obj.offsetHeight+document.documentElement.scrollTop>0){
            obj.style.top=(ev.clientY-mouse_top)+"px";
        }
	 }
}

/**
 * 弹出预览浮动按钮
 * 
 */
jQuery(function() {
	var gohome = '<div id="previewtest" style="position:absolute;top:25%;right:0px;width:50px;height:50px;line-height:50px;text-align:center;z-index:100;background:#fff;border-radius:50px;"><a class="preview" style="color:red !important;font-weight: bolder;">预览<a></div>';
	
	 $("body").append(gohome);
	 
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