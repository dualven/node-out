// 添加分类
function add() {
	$("input[name='type']").val('');
	$("#menuform").attr("action", "save.html");
	$('#modal-form').modal('show');
}
// 修改分类
function edit(obj) {
	var navId = $(obj).attr('navid');
	var navName = $(obj).attr('navname');
	var navOrder = $(obj).attr('navorder');
	$("input[name='id']").val(navId);
	$("input[name='type']").val(navName);
	$("input[name='order']").val(navOrder);
	$("#menuform").attr("action", "update.html");
	$('#modal-form').modal('show');
}