/**
 * pushmessage-create.js
 * 消息推送
 * @author zhupengfei 2016/8/10
 * 
 */

/**
 * 消息推送 - 消息创建  begin
 */
/**
 * 
 * 创建消息
 * @param url 提交的请求url
 */
function add(url){
    $("input[name='title']").val('');
    $("input[name='content']").val('');
    $("input[name='wapUrl']").val('');
    $("select[name='showType']").val('0');
    $("select[name='send_group_id']").val('');
    $("#menuform").attr("action", url);
    $('#modal-form').modal('show');
}

/**
 * 
 * 获取当前分组的下级分组集合
 * @param url 提交的请求url
 */
function loadchildData(url){
    var parentId = $("#parentgroup").val();
    $("#childgroup").empty();//清空div中内容
    if(parentId != ""){
        $.ajax({
            url: url,
            type: 'POST',
            data: {parentid: parentId},
            dataType: 'json',
            success: function(msg){
                if(msg != "[]"){
                	$("<span>可指定到下级分组:&nbsp;&nbsp;</span>").appendTo($("#childgroup"));
                	var length = 0;
                    $.each(eval(msg),function(i,item){
                        $("<input type='checkbox' name='group_items[]' value='"+item.id+"' checked='checked'>").appendTo($("#childgroup"));                 
                        $("<span>"+item.name+"&nbsp;&nbsp;&nbsp;</span>").appendTo($("#childgroup"));
                        length ++;
                    });
                    $("<input type='hidden' name='childgroup_count' value='"+length+"'>").appendTo($("#childgroup"));
                }
            }
        });                
    }
}
/**
 * 消息推送 - 消息创建  end
 */

/**
 * 
 * 消息推送 - 分组管理 begin
 * 
 */
/**
 * 添加分组
 * @param  url  提交的请求url
 */
function add_group(url){
	$("input[name='name']").val('');
	$("#menuform").attr("action", url);
	$('#modal-form').modal('show');
}

/**
 * 添加子分组
 * @param obj 
 * @param url 提交的请求url
 */
function add_child(obj,url){
	var ruleId=$(obj).attr('ruleId');
	$("input[name='id']").val(ruleId);
	$("input[name='name']").val('');
	$("#menuform").attr("action", url);
	$('#modal-form').modal('show');
}

/**
 * 
 * 修改用户组名
 * @param obj
 * @param url 提交的请求url
 */
function edit(obj,url){
	var ruleId=$(obj).attr('ruleId');
	var ruletitle=$(obj).attr('ruletitle');
	$("input[name='id']").val(ruleId);
	$("input[name='name']").val(ruletitle);
	$("#menuform").attr("action", url);
	$('#modal-form').modal('show');
}

/**
 * 导入用户信息
 */
function userimport(obj,url){
	var ruleId=$(obj).attr('ruleId');
	$("input[name='groupId']").val(ruleId);
	$("#menuform-import").attr("action", url);
	$('#modal-import').modal('show');
}
/**
 * 
 * 消息推送 - 分组管理 begin
 * 
 */
