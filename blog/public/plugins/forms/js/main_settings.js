function activate_license(){
	
	//send to backend using ajax call
	$.ajax({
		   type: "GET",
		   async: true,
		   url: "https://www.appnitro.com/licensemanager/activate.php",
		   data: {install_url: window.location.href,
		   		  license_key: $("#license_box").data("licensekey")
				  },
		   cache: false,
		   global: true,
		   dataType: "jsonp",
		   error: function(xhr,text_status,e){
		   },
		   success: function(response_data){
		   		$("#dialog-change-license").dialog('close');
		   		$("#dialog-change-license-btn-save-changes").prop("disabled",false);
				$("#dialog-change-license-btn-save-changes").text("Activate New License");

				if(response_data.status == "invalid_key" || response_data.status == "usage_exceed"){
					alert(response_data.message);
					$("#lic_activate").hide();
					$("#unregisted_holder").text('UNREGISTERED LICENSE');
					$("#lic_type").text("Invalid License");
					$("#lic_customer_id").text('-');
					$("#lic_customer_name").text('-');

					//send to backend using ajax call
					$.ajax({
						   type: "POST",
						   async: true,
						   url: "unregister.php",
						   data: {unregister: '1'},
						   cache: false,
						   global: false,
						   dataType: "json",
						   error: function(xhr,text_status,e){
								//error, display the generic error message		  
						   },
						   success: function(response_data){
								//do nothing   
						   }
					});
				}else if(response_data.status == "valid_key"){
					$("#lic_customer_id").text(response_data.customer_id);
					$("#lic_customer_name").text(response_data.customer_name);
					$("#lic_activate").hide();
					$("#unregisted_holder").text('');
					$("#lic_type").text(response_data.license_type);

					//send to backend using ajax call
					$.ajax({
						   type: "POST",
						   async: true,
						   url: "register.php",
						   data: {
						   		customer_name: response_data.customer_name,
						   		customer_id: response_data.customer_id,
						   		license_key: $("#license_box").data("licensekey")},
						   cache: false,
						   global: false,
						   dataType: "json",
						   error: function(xhr,text_status,e){
								//error, display the generic error message		  
						   },
						   success: function(response_data){
								//do nothing   
						   }
					});
				}
		   }
	});
}

$(function(){
    
	/***************************************************************************************************************/	
	/* 1. Load Tooltips															   				   				   */
	/***************************************************************************************************************/
	
	//we're using jquery tools for the tooltip	
	$(".helpmsg").tooltip({
		
		// place tooltip on the bottom
		position: "bottom center",
		
		// a little tweaking of the position
		offset: [10, 20],
		
		// use the built-in fadeIn/fadeOut effect
		effect: "fade",
		
		// custom opacity setting
		opacity: 0.8,
		
		events: {
			def: 'click,mouseout'
		}
		
	});
	
	/***************************************************************************************************************/	
	/* 2. SMTP Servers settings 														 		  				   */
	/***************************************************************************************************************/
	
	//attach event to 'send notification to my inbox' checkbox
	$("#smtp_enable").click(function(){
		if($(this).prop("checked") == true){
			$("#ms_box_smtp .ms_box_email").slideDown();
		}else{
			$("#ms_box_smtp .ms_box_email").slideUp();
		}
	});

	

	/***************************************************************************************************************/	
	/* 3. Misc Settings 																 		  				   */
	/***************************************************************************************************************/
	
	//Attach event to "advanced options" link 
	$("#more_option_misc_settings").click(function(){
		if($(this).text() == 'advanced options'){
			//expand more options
			$("#ms_box_misc .ms_box_more").slideDown();
			$(this).text('hide options');
			$("#misc_settings_img_arrow").attr("src","images/icons/38_topred_16.png");
		}else{
			$("#ms_box_misc .ms_box_more").slideUp();
			$(this).text('advanced options');
			$("#misc_settings_img_arrow").attr("src","images/icons/38_rightred_16.png");
		}
 
		return false;
	});

	//attach event to 'enable ip address restriction' checkbox
	$("#enable_ip_restriction").click(function(){
		if($(this).prop("checked") == true){
			$("#div_ip_whitelist").slideDown();
		}else{
			$("#div_ip_whitelist").slideUp();
		}
	});

	//attach event to 'enable account locking' checkbox
	$("#enable_account_locking").click(function(){
		if($(this).prop("checked") == true){
			$("#div_account_locking").slideDown();
		}else{
			$("#div_account_locking").slideUp();
		}
	});

	
	/***************************************************************************************************************/	
	/* 4. Attach event to 'Save Settings' button																   */
	/***************************************************************************************************************/
	$("#button_save_main_settings").click(function(){
		
		if($("#button_save_main_settings").text() != 'Saving...'){
				
				//display loader while saving
				$("#button_save_main_settings").prop("disabled",true);
				$("#button_save_main_settings").text('Saving...');
				$("#button_save_main_settings").after("<img style=\"margin-left: 10px\" src='images/loader_small_grey.gif' />");
				
				$("#ms_form").submit();
		}
		
		
		return false;
	});


	/***************************************************************************************************************/	
	/* 5. Dialog Box for change license																		   	   */
	/***************************************************************************************************************/
	
	$("#dialog-change-license").dialog({
		modal: true,
		autoOpen: false,
		closeOnEscape: false,
		width: 400,
		position: ['center',150],
		draggable: false,
		resizable: false,
		buttons: [{
			text: 'Activate New License',
			id: 'dialog-change-license-btn-save-changes',
			'class': 'bb_button bb_small bb_green',
			click: function() {
				if($("#dialog-change-license-input").val() == ""){
					alert("Please enter your license key!");
				}else{
					$("#dialog-change-license-btn-save-changes").prop("disabled",true);
					$("#dialog-change-license-btn-save-changes").text("Activating...");

					$("#license_box").data("licensekey",$("#dialog-change-license-input").val());
					activate_license();
				}
			}
		},
		{
			text: 'Cancel',
			id: 'dialog-change-license-btn-cancel',
			'class': 'btn_secondary_action',
			click: function() {
				$("#dialog-change-license-btn-save-changes").prop("disabled",false);
				$("#dialog-change-license-btn-save-changes").text("Activate New License");
				$(this).dialog('close');
			}
		}]

	});


	$("#ms_change_license").click(function(){
		$("#dialog-change-license").dialog('open');
		return false;
	});

	$("#lic_activate").click(function(){
		if($(this).text() != 'activating...'){
			$(this).text('activating...');
			activate_license();
		}

		return false;
	});

	if($("#lic_activate").length > 0){
		activate_license();
	}

	$("#dialog-change-license-form").submit(function(){
		$("#dialog-change-license-btn-save-changes").click();
		return false;
	});

	/***************************************************************************************************************/	
	/* 6. Form Export / Import Tool																			   	   */
	/***************************************************************************************************************/

	//attach event to export form button
	$("#ms_btn_export_form").click(function(){
		var selected_form_id = $("#export_form_id").val();
		window.location.href = 'export_form.php?form_id=' + selected_form_id;
	});

	//attach event to the export/import selection
	$("input[name=export_import_type]").click(function(){
		var task_type = $(this).val();
		
		$("#tab_export_form,#tab_import_form").hide();

		if(task_type == 'export'){
			$("#tab_export_form").show();
		}else if(task_type == 'import'){
			$("#tab_import_form").show();
		}
	});

	//initialize file uploader for export/import tool
	$('#ms_form_import_file').uploadifive({
		'uploadScript'     	: 'import_form_uploader.php',
		'buttonText'        : 'Select File',
		'removeCompleted' 	: true,
		'formData'         	 : {
								 'session_id': $(".main_settings").data("session_id")
			                  },
		'auto'        : true,
	   	'multi'       : false,
	   	'onUploadError' : function(file, errorCode, errorMsg, errorString) {
        						alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
    					   },
    	'onUploadComplete' : function(file, response) {
    		var is_valid_response = false;
			try{
				var response_json = jQuery.parseJSON(response);
				is_valid_response = true;
			}catch(e){
				is_valid_response = false;
				alert(response);
			}
			
			if(is_valid_response == true && response_json.status == "ok"){
				var uploaded_form_file = response_json.file_name;

				//do ajax call to parse the file
				$.ajax({
					   type: "POST",
					   async: true,
					   url: "import_form_parser.php",
					   data: {file_name: uploaded_form_file},
					   cache: false,
					   global: false,
					   dataType: "json",
					   error: function(xhr,text_status,e){
							   //error, display the generic error message
							   alert("Error while importing file. Error Message:\n" + xhr.responseText);		  
					   },
					   success: function(response_data){
							   
						   if(response_data.status == 'ok'){
							   $("#dialog-form-import-success").data("form_id",response_data.new_form_id);
							   $("#dialog-form-import-success").data("form_name",response_data.new_form_name);

							   $("#form-imported-link").text(response_data.new_form_name);
							   $("#form-imported-link").attr("href","view.php?id=" + response_data.new_form_id);

							   //display success dialog
							   $("#dialog-form-import-success").dialog('open');
						   }else{
						   	   //display error dialog
						   	   if(response_data.status == 'error'){
						   	   		$("#dialog-warning-msg").html(response_data.message);
						   	   }

							   $("#dialog-warning").dialog('open');
						   }	  
							   
					   }
				});
	       	}else{
		       	alert('Error uploading file. Please try again.');
			}  
    	} 

	});

	//dialog box for import success
	$("#dialog-form-import-success").dialog({
		modal: true,
		autoOpen: false,
		closeOnEscape: false,
		width: 450,
		resizable: false,
		draggable: false,
		position: ['center','center'],
		open: function(){
			$("#btn-form-success-done").blur();
		},
		buttons: [{
				text: 'Done',
				id: 'btn-form-success-done',
				'class': 'bb_button bb_small bb_green',
				click: function() {
					$(this).dialog('close');
				}},
				{
				text: 'Edit Form',
				id: 'btn-form-success-edit',
				'class': 'btn_secondary_action',
				click: function() {
					var current_form_id = $("#dialog-form-import-success").data("form_id");
					window.location.replace('edit_form.php?id=' + current_form_id);
				}
			}]

	});

	//dialog for import failed
	$("#dialog-warning").dialog({
		modal: true,
		autoOpen: false,
		closeOnEscape: false,
		width: 450,
		position: ['center','center'],
		draggable: false,
		resizable: false,
		open: function(){
			$(this).next().find('button').blur()
		},
		buttons: [{
			text: 'OK',
			'class': 'bb_button bb_small bb_green',
			click: function() {
				$(this).dialog('close');
			}
		}]
	});
	
});