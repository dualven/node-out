(function(Q, jQuery){
	//拓扑操作库
	var actions = {
		reboot: function(contentPath, data, classId){
			showConfigMsg( "你确定要重启吗？", function (r) {
	            if (r) { //r confim ok is true,  if you want opt
	        	var mac = data.properties.devMAC;
	            	saveAjaxData(contentPath + "/netMng/sysSet.do?classId=" + classId +"&mac="+mac);
	            }
	        });
		},
		reset: function(contentPath, data, classId){
			showConfigMsg( "危险操作，你确定要恢复出厂设置吗？", function (r) {
	            if (r) { //r confim ok is true,  if you want opt
	        	var mac = data.properties.devMAC;
	            	saveAjaxData(contentPath +　"/netMng/sysSet.do?classId=" + classId +"&mac="+mac);
	            }
	        });
		},
		upgrade: function(contentPath, data, classId){
		    	var mac = data.properties.devMAC;
			saveAjaxData(contentPath + "/netMng/sysSet.do?classId=" + classId +"&mac="+mac);
		},
		localWeb: function(contentPath, data){
			var ip = data.properties.devIP;
			var model=data.properties.model;
			if(model.toUpperCase().indexOf("CGW600") != -1 || model.toUpperCase().indexOf("CGW800") != -1){
				//新本地web流程
      			window.open(contentPath+"/rest/proxy/http?v3ip=" + ip);
  			}else{
  				//老本地web流程
  			    window.open(contentPath+"/rest/proxy?v3ip=" + ip);
  			}
		},
		telnet: function(contentPath, data){
			var ip = data.properties.devIP;
			openTelnet(contentPath + "/rest/telnet/open", ip);
		},
		dynamic:  function(contentPath, data){
			var mac = data.properties.devMAC;
			openWindow("动态信息", contentPath + "/topo/dynamic.do?mac=" + mac);
		},
		config: function(contentPath, data){
			var mac = data.properties.devMAC;
			openWindow("设备配置", contentPath + "/topo/devSet.do?mac=" + mac);
		},
		alarm: function(contentPath, data){
			var mac = data.properties.devMAC;
			window.location.href = contentPath + "/topo/alarm.do?mac=" + mac;
			//window.open(contentPath + "/topo/alarm.do?mac=" + mac);
		},
		capability: function(contentPath, data){
			var mac = data.properties.devMAC;
			window.location.href = contentPath + "/topo/capability.do?mac=" + mac;
			//window.open(contentPath + "/topo/capability.do?mac=" + mac);
		}
	};
	var operation = {
		initRightMenu: function(){
			Q.getMenuItems = function(graph, node){
				var i = [];
				if(!node){
					i.push({
		                text: getI18NString("Clear"),
		                action: function() {
		                    graph.clear();
		                }
		            });
				}else{
					if(node._className == "Q.Node" || node.enableSubNetwork){
						if(node.image != "lamp" && node.image.indexOf("Q-") == -1){
						i.push({
			                text: getI18NString("Edit"),
			                action: function() {
								var properties = {};	
								if(!jQuery.isEmptyObject(node.properties)){
									properties = node.properties;
								}else{
									properties.name = "";
									properties.type= "";
									properties.vendor= "";
									properties.model= "";
									properties.form= "";
									properties.devIP= "";
									properties.devMAC= "";
									properties.software= "";
									properties.proxyIP= "";
									properties.proxyMac= "";
									properties.proxyServer= "";
									properties.description= "";
								}
								$.post(conPath + "/topo/getVendors.do", function(data){
									data = JSON.parse(data);
									data = data.msg;
									var optHtml = "";
									for(var key in data){
										optHtml += "<option value='" + data[key] + "'>" + data[key] + "</option>";
									}
			                	var content = "<form id='TopoForm'>" +
			                				"<table cellpadding='0' cellspacing='0' class='form_table'>"+
			           							"<tr class='tr_dark'>"+
			               							"<td class='form_label'>设备名称：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='name' name='name' value='" + properties.name + "'/>"+                   
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_light'>"+
			               							"<td class='form_label'>厂商：</td>"+
			               							"<td class='form_content'>"+
			               							"<select class='form_select' name='vendor' id='vendor'>"+
			               							optHtml +
				        							"</select>"+
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark'>"+
			               							"<td class='form_label'>网元类型：</td>"+
			               							"<td class='form_content'>"+
			               							"<select class='form_select' name='type' id='type'>"+
				        							"</select>"+                  
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_light'>"+
			               							"<td class='form_label'>设备型号：</td>"+
			               							"<td class='form_content'>"+
			               							"<select class='form_select' name='model' id='model'>"+
				        							"</select>"+ 
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark' style='display:none;'>"+
			               							"<td class='form_label'>设备形态：</td>"+
			               							"<td class='form_content'>"+
			               							"<select class='form_select' name='form' id='form'>"+
				        								"<option value='AP'>AP</option>"+
				        								"<option value='cgw'>cgw</option>"+
				        							"</select>"+                   
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark'>"+
			               							"<td class='form_label'>设备IP：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='devIP' name='devIP' value='" + properties.devIP + "'/>"+                   
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_light'>"+
			               							"<td class='form_label'>设备MAC：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='devMAC' name='devMAC' readonly='readonly' value='" + properties.devMAC + "'/>"+                   
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark' style='display:none;'>"+
			               							"<td class='form_label' style='display:none;'>软件版本：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='softeware' name='software' value='" + properties.software + "'/>"+                  
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_light' style='display:none;'>"+
			               							"<td class='form_label' style='display:none;'>代理IP：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='proxyIP' name='proxyIP' value='" + properties.proxyIP + "'/>"+                  
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark' style='display:none;'>"+
			               							"<td class='form_label' style='display:none;'>代理Mac：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='proxyMac' name='proxyMac' value='" + properties.proxyMac + "'/>"+                  
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_light' style='display:none;'>"+
		               							"<td class='form_label' style='display:none;'>代理服务器：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='proxyServer' name='proxyServer' value='" + properties.proxyServer + "'/>"+                  
			               							"</td>"+
			           							"</tr>"+
			           							"<tr class='tr_dark'>"+
				        							"<td class='form_label'>读共同体：</td>"+
				        							"<td class='form_content'>"+
				        							"<input type='text' class='input_text' id='snmpRead' name='snmpRead' value='" + properties.snmpRead + "'/>"+                   
				        							"</td>"+
				        						"</tr>"+
				        						"<tr class='tr_light'>"+
				        							"<td class='form_label'>写共同体：</td>"+
				        							"<td class='form_content'>"+
				        							"<input type='text' class='input_text' id='snmpWrite' name='snmpWrite' value='" + properties.snmpWrite + "'/>"+                   
				        							"</td>"+
				        						"</tr>"+
			           							"<tr class='tr_dark'>"+
			               							"<td class='form_label'>描述：</td>"+
			               							"<td class='form_content'>"+
														"<input type='text' class='input_text' id='description' name='description' value='" + properties.description + "'/>"+                   
			               							"</td>"+
			           							"</tr>"+
											"</table>" +
										"</form>";
			                	var validate = function(){
			                		var validateCondition = [
        		                         {name: "name", rule: "validate[required,maxSize[100]]"},
        		                         {name: "devMAC", rule: "validate[required,mac]"},
        		            	         {name: "devIP", rule: "validate[required,ipv4]"}
        		                     ];
        		                     validateInit(validateCondition, "TopoForm");
			                	};
								openInputWindow(null, "信息", content, function(a,e){
									if (!validateForm("TopoForm")) {
										return;
								    }
									node.name = a.find("input[id='name']").val();
									var list = a.find("input[class='input_text'], select[class='form_select']");
									list.each(function(i){
										var key = $(this).attr("name");
										var value = $(this).val();
										node.set(key,value);
									})
									closeWindow("openInputWindowId");
									e.stopPropagation();
								}, validate, function(a,e){
									closeWindow("openInputWindowId");
								});
								
								
								function loadCurrent(){
									var vendor = $("#TopoForm #vendor").val();
									$.post(conPath + "/topo/getTypes.do?vendor=" + vendor, function(data){
										data = JSON.parse(data);
										data = data.msg;
										$("#TopoForm #type").html("");
										var options = "";
										for(var key in data){
											options += "<option value='" + data[key] + "'>" + data[key] + "</option>";
										}
										$("#TopoForm #type").html(options);
										$("#TopoForm #type").val(properties.type);
										var type = $("#TopoForm #type").val();
										$.post(conPath + "/topo/getModels.do?vendor=" + vendor + "&type=" + type, function(data){
											data = JSON.parse(data);
											data = data.msg;
											$("#TopoForm #model").html("");
											var opt = "";
											for(var k in data){
												opt += "<option value='" + data[k] + "'>" + data[k] + "</option>";
											}
											$("#TopoForm #model").html(opt);
											$("#TopoForm #model").val(properties.model);
										});
									})
									
								};
								
								function loadVendor(){
									var vendor = $("#TopoForm #vendor").val();
									$.post(conPath + "/topo/getTypes.do?vendor=" + vendor, function(data){
										data = JSON.parse(data);
										data = data.msg;
										$("#TopoForm #type").html("");
										var options = "";
										for(var key in data){
											options += "<option value='" + data[key] + "'>" + data[key] + "</option>";
										}
										$("#TopoForm #type").html(options);
										var type = $("#TopoForm #type").val();
										$.post(conPath + "/topo/getModels.do?vendor=" + vendor + "&type=" + type, function(data){
											data = JSON.parse(data);
											data = data.msg;
											$("#TopoForm #model").html("");
											var opt = "";
											for(var k in data){
											    opt += "<option value='" + data[k] + "'>" + data[k] + "</option>";
											}
											$("#TopoForm #model").html(opt);
										});
									})
									
								};
								
								//厂商变化
								$("#TopoForm #vendor").change(function(){
									loadVendor();
								});
								
								//网元类型
								$("#TopoForm #type").change(function(){
									var vendor = $("#TopoForm #vendor").val();
									var type = $("#TopoForm #type").val();
									$.post(conPath + "/topo/getModels.do?vendor=" + vendor + "&type=" + type, function(data){
										data = JSON.parse(data);
										data = data.msg;
										$("#TopoForm #model").html("");
										var opt = "";
										for(var k in data){
											opt += "<option value='" + data[k] + "'>" + data[k] + "</option>";
										}
										$("#TopoForm #model").html(opt);
									});
								});
								
								
								$("#TopoForm #vendor").val(properties.vendor);
								loadCurrent();
			                });
							}
			            });
						i.push(Q.PopupMenu.Separator);
						}
					};
		            i.push({
		            	text: getI18NString("Delete Element"),
		            	action: function(){
		            		graph.removeElement(node);
		            	}
		            });
		            i.push(Q.PopupMenu.Separator);
	                i.push({
	                    text: getI18NString("Send to Top"),
	                    action: function() {
	                        node.zIndex = 1,
	                        graph.sendToTop(node),
	                        graph.invalidate()

	                    }
	                });
	                i.push({
	                    text: getI18NString("Send to Bottom"),
	                    action: function() {
		                	node.zIndex = -1,
		                	graph.sendToBottom(node),
		                	graph.invalidate()
	                    }
	                })
				}
	            return i;
			}
		},
		
		initGraphEditor: function(data){
			 function e(e) {
		        var o = {};
		        return o[Q.Styles.SHAPE_FILL_COLOR] = e,
		        o[Q.Styles.SHAPE_STROKE] = .5,
		        o[Q.Styles.SHAPE_STROKE_STYLE] = "#CCC",
		        o[Q.Styles.LABEL_BACKGROUND_COLOR] = "#FF0",
		        o[Q.Styles.SHAPE_FILL_COLOR] = e,
		        o[Q.Styles.LABEL_SIZE] = {
		            width: 100,
		            height: 20

		        },
		        o[Q.Styles.LABEL_PADDING] = 5,
		        o[Q.Styles.LABEL_OFFSET_Y] = -10,
		        o[Q.Styles.SHAPE_FILL_GRADIENT] = r,
		        o[Q.Styles.LABEL_POSITION] = Q.Position.CENTER_TOP,
		        o[Q.Styles.LABEL_ANCHOR_POSITION] = Q.Position.LEFT_BOTTOM,
		        o

		    }
		    Q.registerImage("lamp", Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, -8, -8, 16, 16));
		    var r = new Q.Gradient(Q.Consts.GRADIENT_TYPE_RADIAL, [Q.toColor(2868903935), Q.toColor(871296750), Q.toColor(1149798536), Q.toColor(862348902)], [.1, .3, .7, .9], 0, -.2, -.2);
			var d;
			data ? d = data : d ="";
			$(".graph-editor").graphEditor({
		        data: d,
		        images: [
		            {
		            	name:'网元',
		            	root: '../assets/img/topo/flat/',
		            	images: 
		            		['icon-AC.png','icon-GW.png',
		            		 'icon-WA2020.png','icon-OA2020L.png',
		            		 'icon-TA2020SP.png','icon-TA2025ac.png',
		            		 'icon-OA5025.png','icon-WA6025.png',
		            		 'icon-HuaweiS5720.png','icon-HuaweiS9303.png',
		            		 'icon-HengmaoPOE24SW.png','icon-HengmaoPOE8SW.png',
		            		 'icon-Data.png','icon-Edu.png',
		            		 'icon-Internet.png','icon-server.png'
		            		 ],
		            		//['access server.png','aggregation switch .png','AP.png','common router.png','common switch.png','concentrator.png',
		            	    //     'core switch.png','DD-WRT.png','edage switch.png','GK.png','high level router.png','high power AP.png','MCU.png',
		            	    //     'middle router.png','network telephone system.png','socket switch.png','SOHO router.png','stack switch.png',
		            	    //     'voice rote.png','wireless network adapter.png','PBX.png','secure gateway.png','firewall.png','CG.png',
		            	    //     'intrusion detection system.png','deep inspection firewall.png','voice server.png','voice gateway.png'],
		            	close:true
		            },
		            {
		            	name:'终端',
		            	root: '../assets/img/topo/',
		            	images:[],
		            	close: true
		            },
		            {
		                name:'自定义图标',
		                imageWidth:30,
		                imageHeight:30,
		                images:[
		                	{image:'lamp',properties:{name:'Message'},styles:e('#F00')},
		                	{image:'lamp',properties:{name:'Message'},styles:e('#FF0')},
		                	{image:'lamp',properties:{name:'Message'},styles:e('#0F0')},
		                	{image:'lamp',properties:{name:'Message'},styles:e('#0FF')},
		                	{image:'lamp',properties:{name:'Message'},styles:e('#00F')},
		                	{image:'lamp',properties:{name:'Message'},styles:e('#F0F')}
		                ]
		            }
		        ],
		        callback:function(e){
		        	function r(e,r){//新建网元的坐标
		        		var o=i;
		        		e=Math.round(e/o)*o;
		        		r=Math.round(r/o)*o;
		        		return [e,r];
		        		}
		        	var o=e.graph;
		        	o.moveToCenter();
		        	var i=(new GridBackground(o),10);
		        	
		        	o.interactionDispatcher.addListener(


		        		function(e){
		        			if(e.kind==Q.InteractionEvent.ELEMENT_MOVE_END){
		        				var o=e.datas;
		        				return 
		        					void o.forEach(function(e){
		        						if(e instanceof Q.Node && !(e instanceof Q.Group)){
		        							var o=r(e.x,e.y);
		        							e.setLocation(o[0],o[1])
		        						}
		        					})
		        			}
		        			if(e.kind==Q.InteractionEvent.POINT_MOVE_END){
		        				var i=e.data;
		        				Q.log(e.point);
		        				var t=e.point.segment;
		        				return 
		        					t.points=r(t.points[0],t.points[1]),
		        					void i.invalidate()
		        			}
		        			if(e.kind==Q.InteractionEvent.ELEMENT_CREATED){
		        				var l=e.data;
		        				if(l instanceof Q.Edge){
		        					l.name = l.from.name+"to"+l.to.name;
		        					if($('#theme-select').val()=="创建网线"){
		        						$.TopoUI.cable(l);
		        					}
		        					if($('#theme-select').val()=="创建光纤"){
		        						$.TopoUI.fiber(l);
		        					}
		        					if($('#flow-select').val()=="千兆"){
		        						l.setStyle(Q.Styles.EDGE_WIDTH, 3);
		        					}
		        					if($('#flow-select').val()=="万兆"){
		        						l.setStyle(Q.Styles.EDGE_WIDTH, 5);
		        					}
		        				}
		        				if(!(l instanceof Q.Node))
		        					return;
		        				var a=r(l.x,l.y);
		        				return void l.setLocation(a[0],a[1])//返回true or false
		        			}



		        		}//fun(e)

		        	);
		        }
		    })
		},

		editSubmit: function(contentPath,subnetId){
//			$("div[title='导出JSON']").triggerHandler("click");
			var title=getI18NString("Export JSON");
			$("div[title='"+title+"']").triggerHandler("click");
			var topoJSON = Q.topoJSON;
			$.post(contentPath + "/topo/update.do",{'topo':topoJSON,'subnetId': subnetId},function(data){
				data = JSON.parse(data);
				if(data.success){
					swal({title:"OK",text:"提交成功",type:"success"});
					//重新进入子网图
					//loadAjaxData("mainContent", contentPath + "/topo/index.do");
				}else{
					//closeWindow("openInputWindowId");
					swal({title:"ERROR",text:"操作失败！",type:"warning"});
				}
			})
		},
		initConfigMenu: function(contentPath){
			Q.getMenuItems = function(graph, node, event){
				var i = [];
				if(!node){
					
				}else{
					if(node._className == "Q.Node" && !node.enableSubNetwork){
						$.post(contentPath + "/topo/getOperations.do?mac=" + node.properties.devMAC, function(data){
							data = JSON.parse(data); 
							data = data.msg;
							for(var k in data){
								if(jQuery.isEmptyObject(data[k])){
									continue;
								}
								if(k == "sysOpt"){
									var sysopers = data[k];
									var ii = 0;
									for(var oper in sysopers){
										ii++;
										var value = sysopers[oper];
										var item = {};
										item.text= value.uiname;
										item.fnName = value.className;
										item.classId = value.classId;
										item.action = function(evt, menu){
											actions[menu.fnName](contentPath, node, menu.classId);
										};
										graph.popupmenu._items.push(item);
										if(ii != sysopers.length-1){
											graph.popupmenu._items.push(Q.PopupMenu.Separator);
										}
									}
								}else if(k == "sysGet"){
									var item = {};
									item.text= "动态信息";
									item.fnName = "dynamic";
									item.action = function(evt, menu){
										actions[menu.fnName](contentPath, node);
									};
									graph.popupmenu._items.push(item);
									graph.popupmenu._items.push(Q.PopupMenu.Separator);
								}else if(k == "sysSet"){
									var item = {};
									item.text= "设备配置";
									item.fnName = "config";
									item.action = function(evt, menu){
										actions[menu.fnName](contentPath, node);
									};
									graph.popupmenu._items.push(item);
									graph.popupmenu._items.push(Q.PopupMenu.Separator);
								}
							graph.popupmenu.render();
							graph.popupmenu.showAt(event.pageX, event.pageY);
							}
						})
					}
				}
	            return i;
			}
		}
	};
	jQuery.extend({
		TopoOperation: operation
	});
	
	
	function buidKey(node){
		var poperties = node.properties;
		var key = poperties.vendor + "." + poperties.type + "." + poperties.model;
		return key;
	}
	
	
})(Q, jQuery);


//拓扑UI库
(function(Q, jQuery){
	var timerObj = new Object();
	var ui = {
		//设备告警ui
		alarmUI: function(node, number){
			var num = parseInt(number);
			var _alarmUI= new Q.LabelUI("告警数量：" + num);
			_alarmUI.type = "AlarmHandle";
			_alarmUI.showPointer = true;
			_alarmUI.offsetY = -3;
			_alarmUI.offsetX = 3;
			_alarmUI.pointerWidth = 8;
			_alarmUI.border = 1;
			//_alarmUI.position = Q.Position.RIGHT_TOP;
			_alarmUI.anchorPosition = Q.Position.LEFT_BOTTOM;
			_alarmUI.fontSize = 12;
			_alarmUI.padding = 3;
			_alarmUI.borderRadius = 4;
			if(num > 3 && number < 10){
				_alarmUI.backgroundColor = "#FFFF00";
			}else if(num >= 10){
				_alarmUI.backgroundColor = "#FF0033";
			}else{
				_alarmUI.backgroundColor = "#FFCC33";
			}
			node.addUI(_alarmUI);
			return _alarmUI;
		},
		//网元状态ui
		devStateUI: function(node, color){
			if(!color){
				color = "#FFFF00"
			}
			var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, -2, -3, 16, 16);
			var shape = new Q.ImageUI(circle);
			shape.position = Q.Position.LEFT_TOP;
			shape.layoutByAnchorPoint = false;
			shape.name = "";
			shape.lineWidth = 1;
			shape.strokeStyle = color;
			shape.fillColor = color;
			shape.zIndex = -1;
			node.addUI(shape);
			return shape;
		},
		edageWithXUI: function(edage, color){
			var labelx = new Q.LabelUI('x');//新建标签x
			labelx.position = Q.Position.CENTER_TOP;
			labelx.anchorPosition = Q.Position.LEFT_BOTTOM;
			labelx.fontSize = 15;
			labelx.fontStyle = "bolder";
			labelx.color = color; //新建标签x
			edage.addUI(labelx); //放入
			edage.tooltip="离线";
			var propName = "T"+edage.to.properties.devMAC;
			if(timerObj[propName] != undefined && timerObj[propName] != ""){
				clearInterval(timerObj[propName]);
				timerObj[propName] = "";
			}
			return labelx;
		},
		//光纤
		fiber:function(edage){
			edage.name="光纤"+edage.from.name+"to"+edage.to.name;
			edage.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 12, 0.01, 4]);
			edage.setStyle(Q.Styles.LINE_CAP, "round");
			edage.setStyle(Q.Styles.EDGE_OUTLINE, 1);
			edage.setStyle(Q.Styles.EDGE_OUTLINE_STYLE, "#0F0");
		},
		//网线
		cable:function(edage){
			edage.name="网线"+edage.from.name+"to"+edage.to.name;
			edage.setStyle(Q.Styles.EDGE_LINE_DASH, [2, 1]);
			edage.setStyle(Q.Styles.ARROW_TO_LINE_DASH, [2, 1]);
			edage.setStyle(Q.Styles.ARROW_FROM, Q.Consts.SHAPE_ARROW_2);
		},   
		//动态效果
		dynamic :function(edage){
			var offset = 0;
			var index = 0;
			var propName = "T"+edage.to.properties.devMAC;
			if(timerObj[propName] == undefined || timerObj[propName] == ""){
				var timer = setInterval(function(){
				    offset += -2;
				    edage.setStyle(Q.Styles.EDGE_LINE_DASH_OFFSET, offset);
				    index++;
				    index = index%20;
				    edage.setStyle(Q.Styles.ARROW_FROM_OFFSET, {x: 0.3 + 0.02 * (20 - index), y: -10});
				}, 150);
				timerObj[propName] = timer;
			}
			
		}
	}
	
	jQuery.extend({
		TopoUI: ui//将ui合并到jquery的全局对象中。
	});
	
})(Q, jQuery)



//子网拓扑收集信息对话框
function gatherInfo(node, graph){
		if(node._className != "Q.Node" || node.enableSubNetwork){
			return;
		}
		if(node.image == "lamp" || node.image.indexOf("Q-") != -1){
			return;
		}
		$.post(conPath + "/topo/getVendors.do", function(data){
			data = JSON.parse(data);
			data = data.msg;
			var option = "";
			for(var key in data){
				option += "<option value='" + data[key] + "'>" + data[key] + "</option>";
			}
		var content = "<form id='TopoForm'>" +
				"<table cellpadding='0' cellspacing='0' class='form_table'>"+
						"<tr class='tr_dark'>"+
							"<td class='form_label'>设备名称：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='name' name='name' value=''/>"+                   
							"</td>"+
						"</tr>"+
						"<tr class='tr_light'>"+
							"<td class='form_label'>厂商：</td>"+
							"<td class='form_content'>"+
							"<select class='form_select' name='vendor' id='vendor'>"+
									option +
							"</select>"+                  
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark'>"+
							"<td class='form_label'>网元类型：</td>"+
							"<td class='form_content'>"+
							"<select class='form_select' name='type' id='type'>"+
							"</select>"+
							"</td>"+
						"</tr>"+
						"<tr class='tr_light'>"+
							"<td class='form_label'>设备型号：</td>"+
							"<td class='form_content'>"+
							"<select class='form_select' name='model' id='model'>"+
							"</select>"+  
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark' style='display:none;'>"+
							"<td class='form_label'>设备形态：</td>"+
							"<td class='form_content'>"+
							"<select class='form_select' name='form' id='form'>"+
								"<option value='AP'>AP</option>"+
								"<option value='cgw'>cgw</option>"+
							"</select>"+                 
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark'>"+
							"<td class='form_label'>设备IP：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='devIP' name='devIP' value=''/>"+                   
							"</td>"+
						"</tr>"+
						"<tr class='tr_light'>"+
							"<td class='form_label'>设备MAC：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='devMAC' name='devMAC' value='' onkeyup='javascript:this.value= this.value.toLowerCase();'/>"+                   
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark' style='display:none;'>"+
							"<td class='form_label'>软件版本：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='softeware' name='software' value=''/>"+                  
							"</td>"+
						"</tr>"+
						"<tr class='tr_light' style='display:none;'>"+
							"<td class='form_label'>代理IP：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='proxyIP' name='proxyIP' value=''/>"+                  
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark' style='display:none;'>"+
							"<td class='form_label'>代理Mac：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='proxyMac' name='proxyMac' value=''/>"+                  
							"</td>"+
						"</tr>"+
						"<tr class='tr_light' style='display:none;'>"+
						"<td class='form_label'>代理服务器：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='proxyServer' name='proxyServer' value=''/>"+                  
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark'>"+
							"<td class='form_label'>读共同体：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='snmpRead' name='snmpRead' value='public'/>"+                   
							"</td>"+
						"</tr>"+
						"<tr class='tr_light'>"+
							"<td class='form_label'>写共同体：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='snmpWrite' name='snmpWrite' value='private'/>"+                   
							"</td>"+
						"</tr>"+
						"<tr class='tr_dark'>"+
							"<td class='form_label'>描述：</td>"+
							"<td class='form_content'>"+
							"<input type='text' class='input_text' id='description' name='description' value=''/>"+                   
							"</td>"+
						"</tr>"+
				"</table>" +
			"</form>";
	var validate = function(){
		var validateCondition = [
	         {name: "name", rule: "validate[required,maxSize[100]]"},
	         {name: "devMAC", rule: "validate[required,mac]"},
	         {name: "devIP", rule: "validate[required,ipv4]"}
	     ];
	     validateInit(validateCondition, "TopoForm");
	};
	openInputWindow(null, "信息", content, function(a,e){
		if (!validateForm("TopoForm")) {
			return;
	    }
		node.name = a.find("input[id='name']").val();
		var list = a.find("input[class='input_text'], select[class='form_select']");
		list.each(function(i){
			var key = $(this).attr("name");
			var value = $(this).val();
			node.set(key,value);
		})
		closeWindow("openInputWindowId");
		e.stopPropagation();
	}, validate, function(a,e){
		graph.removeElement(node);
		closeWindow("openInputWindowId");
		e.stopPropagation();
	});
	
	
	function loadVendor(){
		var vendor = $("#TopoForm #vendor").val();
		$.post(conPath + "/topo/getTypes.do?vendor=" + vendor, function(data){
			data = JSON.parse(data);
			data = data.msg;
			$("#TopoForm #type").html("");
			var options = "";
			for(var key in data){
				options += "<option value='" + data[key] + "'>" + data[key] + "</option>";
			}
			$("#TopoForm #type").html(options);
			var type = $("#TopoForm #type").val();
			$.post(conPath + "/topo/getModels.do?vendor=" + vendor + "&type=" + type, function(data){
				data = JSON.parse(data);
				data = data.msg;
				$("#TopoForm #model").html("");
				var opt = "";
				for(var k in data){
					opt += "<option value='" + data[k] + "'>" + data[k] + "</option>";
				}

				$("#TopoForm #model").html(opt);
			});
		})
		
	}
	//第一次加载根据厂商获取类型，同时根据类型获取设备型号
	loadVendor();
	
	
	//厂商变化
	$("#TopoForm #vendor").change(function(){
		loadVendor();
	});
	
	//网元类型
	$("#TopoForm #type").change(function(){
		var vendor = $("#TopoForm #vendor").val();
		var type = $("#TopoForm #type").val();
		$.post(conPath + "/topo/getModels.do?vendor=" + vendor + "&type=" + type, function(data){
			data = JSON.parse(data);
			data = data.msg;
			$("#TopoForm #model").html = "";
			var opt = "";
			for(var k in data){
				opt += "<option value='" + data[k] + "'>" + data[k] + "</option>";
			}
			$("#TopoForm #model").html(opt);
		});
	});
		});
	

}