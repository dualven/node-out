$(document).ready(function(){
	// 系统升级管理：FILE文件优化
	if($('.uploadJsSql').length > 0){
		$('input[type="file"]').prettyFile();
	}
	
	// 后台系统升级js代码
	jQuery('#uploadBin').click(function(){
		var file = jQuery("input[name='upgradeFile']").val();  
		var filename = file.replace(/.*(\/|\\)/, "");  
		var fileExt = (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename.toLowerCase()) : '';
		var uploadUrl = jQuery('#uploadUrl').val();
		var checkUrl = jQuery('#checkUrl').val();
		var upgradeUrl = jQuery('#upgradeUrl').val();
		
		if(jQuery.trim(file) == ''){
			alert( '请上传bin文件' );
			return;
		}
		
		if(fileExt != 'bin'){
			alert( '请上传bin文件' );
			return;
		}
		
		//console.log('uploadUrl---'+uploadUrl);
		//console.log('file---'+file);
		//console.log('file---'+filename);
		//console.log('file---'+fileExt);
		
		jQuery.ajaxFileUpload({
			url: uploadUrl, 
			secureuri:false,
			fileElementId:'upgradeFile',
			dataType: 'json',
			success: function (data, status){
				//console.log(status);
				//console.log(data);
				jQuery('#updateTitle').html('').html( data.msg );
				
				if(status == 'success' && data.data.url != ''){
					// 上传成功后，执行检查更新系统脚本
					jQuery.ajax({
						type : 'post',
						url : checkUrl,
						cache : false,
						dataType : 'json',
						data : {
							file_path : data.data.url
						},
						success : function(data) {
							//console.log(data);
							if(data.status == '0'){
								//console.log(data);
								
								jQuery('#updateTitle').html('').html(data.msg);
								if(data.status == '0'){
									jQuery('#updateDetail').html('').html(data.info);
								}
								else{
									jQuery('#updateDetail').html('');
								}
								
								jQuery('#uploadBinClick').click(function(){
									// console.log(data.data.url);
									// /edu/Upload/Bin/20160804/57555f19329e3.bin
									
									jQuery('#updateTitle').html('').html('Loading...');
									// 定时闪动文字，让用户把焦点放到这里
									var int;
									int=setInterval(function(){jQuery("#updateTitle").fadeOut(100).fadeIn(100); },200);
									
									// 上传成功后，执行更新系统脚本
									jQuery.ajax({
										type : 'post',
										url : upgradeUrl,
										cache : false,
										dataType : 'json',
										data : {
											file_path : data.url
										},
										success : function(data) {
											if(int) clearInterval(int);
											// console.log(data);
											jQuery('#updateTitle').html('').html(data.msg);
											return;
										},
										error : function() {
											// alert("检出版本发生异常！");
											if(int) clearInterval(int);
											jQuery('#updateTitle').html('').html( "升级版本时发生异常！" );
										}
									});
									
								});
								
							}
							else{
								jQuery('#updateTitle').html('').html( data.msg );
							}
							return;
						},
						error : function() {
							// alert("检出版本发生异常！");
							jQuery('#updateTitle').html('').html( "检查升级包时发生异常！" );
						}
					});
				}
			},
			error: function (data, status, e){
				jQuery('#updateTitle').html('').html( e );
			}
		});
	});
	
});

