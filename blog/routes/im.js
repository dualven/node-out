const express=require('express');
const mysql=require('mysql');
var db = mysql.createPool({host: '10.60.10.88',user:'giedu', password:'123456', database:'giedu20171217'});
module.exports=function(){
	var router=express.Router();
	function fFormatDate(input){
		if((input+'').length==10){
			var date = new Date();
			date.setTime(input*1000);
		}else{
			var date = input;
		}
  		var y = date.getFullYear();
		var m = date.getMonth() + 1;  
		m = m < 10 ? '0' + m : m;  
		var d = date.getDate();  
		d = d < 10 ? ('0' + d) : d;  
		return y + '-' + m + '-' + d;
  	};
  	//学校
  	var school = '00';
	router.post('/getImData', (req, res)=>{
		var data = {
			allschool: [],
	  		sunMsg: [
		  		{
		  			icon: 'envelope-o',
		  			num1: 0,
		  			title1: '聊天记录总数／条'
		  		},
		  		{
		  			icon: 'align-left',
		  			num1: 0,
		  			title1: '文字聊天数／条'
		  		},
		  		{
		  			icon: 'microphone',
		  			num1: 0,
		  			title1: '语音聊天数／条'
		  		},
		  		{
		  			icon: 'photo',
		  			num1: 0,
		  			title1: '图片聊天数／张'
		  		}
	  		],
	  		imlist: [],
	  		listSum: 0
  	    };
  	    //聊天 panel
  	    if(school=='00'){
  	    	//全部学校
  	    	//查学校
  	    	db.query(`SELECT id,name as school FROM edu_school`, (err,jSchool)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jSchool = JSON.parse(JSON.stringify(jSchool));
					data.allschool = jSchool;
					db.query(`SELECT count(1) as sum FROM edu_im_message WHERE create_time>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY))`, (err,jMsg)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							jMsg = JSON.parse(JSON.stringify(jMsg));
							data.sunMsg[0].num1 = jMsg[0].sum;
							db.query(`SELECT data_type,count(data_type) as sum FROM edu_im_message WHERE create_time>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY)) GROUP BY data_type`, (err,jChat)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jChat = JSON.parse(JSON.stringify(jChat));
									if(jChat.length>0){
										for(let i = 0,l=jChat.length;i<l;i++){
											switch(jChat[i].data_type){
												case 1001:
												    data.sunMsg[1].num1 = jChat[i].sum;
												    break;
												case 1002:
												    data.sunMsg[2].num1 = jChat[i].sum;
												    break;
												case 1003:
												    data.sunMsg[3].num1 = jChat[i].sum;
												    break;
												default:
												    break;
											}
										}
									}
									//im统计列表
									db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
										if(err){
											res.status(500).send('database error').end();
									        console.log(err);
										}else{
											jChatList = JSON.parse(JSON.stringify(jChatList));
											data.listSum = jChatList.length;
											data.imlist = jChatList.slice(0,10);
											res.send(data).end();
										}
									});
								}
					  	    });
						}
			  	    });
				}
			});
  	    	
  	    }else{
  	    	//某学校
  	    	db.query(`SELECT id,name as school FROM edu_school WHERE id=${school}`, (err,jSchool)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jSchool = JSON.parse(JSON.stringify(jSchool));
					data.allschool = jSchool;
					db.query(`SELECT count(org_id) as sum FROM edu_im_message WHERE create_time>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY)) AND org_id=${school}`, (err,jMsg)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							jMsg = JSON.parse(JSON.stringify(jMsg));
							data.sunMsg[0].num1 = jMsg[0].sum;
							db.query(`SELECT data_type,count(data_type) as sum FROM edu_im_message WHERE create_time>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY)) AND org_id=${school} GROUP BY data_type`, (err,jChat)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jChat = JSON.parse(JSON.stringify(jChat));
									if(jChat.length>0){
										for(let i = 0,l=jChat.length;i<l;i++){
											switch(jChat[i].data_type){
												case 1001:
												    data.sunMsg[1].num1 = jChat[i].sum;
												    break;
												case 1002:
												    data.sunMsg[2].num1 = jChat[i].sum;
												    break;
												case 1003:
												    data.sunMsg[3].num1 = jChat[i].sum;
												    break;
												default:
												    break;
											}
										}
									}
									//im统计列表
									db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
										if(err){
											res.status(500).send('database error').end();
									        console.log(err);
										}else{
											jChatList = JSON.parse(JSON.stringify(jChatList));
											data.listSum = jChatList.length;
											data.imlist = jChatList.slice(0,10);
											res.send(data).end();
										}
									});
								}
					  	    });
						}
			  	    });
				}
			});
  	    }
		
	});

	router.post('/updateImData', (req, res)=>{
		school = req.body.school;
		var beginDate = req.body.date.substring(0,10);
		    endDate = req.body.date.substring(13,23);
		    beginStamp = Date.parse(new Date(beginDate))/1000;
		    endStamp = (Date.parse(new Date(endDate))/1000)+(60*60*24-1);
		var sunMsg = [
		  		{
		  			icon: 'envelope-o',
		  			num1: 0,
		  			title1: '聊天记录总数／条'
		  		},
		  		{
		  			icon: 'align-left',
		  			num1: 0,
		  			title1: '文字聊天数／条'
		  		},
		  		{
		  			icon: 'microphone',
		  			num1: 0,
		  			title1: '语音聊天数／条'
		  		},
		  		{
		  			icon: 'photo',
		  			num1: 0,
		  			title1: '图片聊天数／张'
		  		}
	  		];
	  		listSum = 0;
		    imlist = [];
	  	if(school=='00'){
		    db.query(`SELECT count(1) as sum FROM edu_im_message WHERE create_time>=${beginStamp} AND create_time<=${endStamp}`, (err,jMsg)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jMsg = JSON.parse(JSON.stringify(jMsg));
					sunMsg[0].num1 = jMsg[0].sum;
					db.query(`SELECT data_type,count(data_type) as sum FROM edu_im_message WHERE create_time>=${beginStamp} AND create_time<=${endStamp} GROUP BY data_type`, (err,jChat)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							jChat = JSON.parse(JSON.stringify(jChat));
							if(jChat.length>0){
								for(let i = 0,l=jChat.length;i<l;i++){
									switch(jChat[i].data_type){
										case 1001:
										    sunMsg[1].num1 = jChat[i].sum;
										    break;
										case 1002:
										    sunMsg[2].num1 = jChat[i].sum;
										    break;
										case 1003:
										    sunMsg[3].num1 = jChat[i].sum;
										    break;
										default:
										    break;
									}
								}
							}
							db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jChatList = JSON.parse(JSON.stringify(jChatList));
									listSum = jChatList.length;
									imlist = jChatList.slice(0,10);
									res.send({sunMsg: sunMsg,listSum:listSum,imlist:imlist}).end();
								}
							});
						}
			  	    });
				}
	  	    });
  	    }else{
  	    	db.query(`SELECT count(org_id) as sum FROM edu_im_message WHERE create_time>=${beginStamp} AND create_time<=${endStamp} AND org_id=${school}`, (err,jMsg)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jMsg = JSON.parse(JSON.stringify(jMsg));
					sunMsg[0].num1 = jMsg[0].sum;
					db.query(`SELECT data_type,count(data_type) as sum FROM edu_im_message WHERE create_time>=${beginStamp} AND create_time<=${endStamp} AND org_id=${school} GROUP BY data_type`, (err,jChat)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							jChat = JSON.parse(JSON.stringify(jChat));
							if(jChat.length>0){
								for(let i = 0,l=jChat.length;i<l;i++){
									switch(jChat[i].data_type){
										case 1001:
										    sunMsg[1].num1 = jChat[i].sum;
										    break;
										case 1002:
										    sunMsg[2].num1 = jChat[i].sum;
										    break;
										case 1003:
										    sunMsg[3].num1 = jChat[i].sum;
										    break;
										default:
										    break;
									}
								}
							}
							db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jChatList = JSON.parse(JSON.stringify(jChatList));
									listSum = jChatList.length;
									imlist = jChatList.slice(0,10);
									res.send({sunMsg: sunMsg,listSum:listSum,imlist:imlist}).end();
								}
							});
						}
			  	    });
				}
	  	    });
  	    }
	});
    router.post('/searchTable', (req, res)=>{
		var key = req.body.key;
		    listSum = 0;
		    imlist = [];
		if(school=='00'&&key==''){
			//全部学校 无关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					listSum = jChatList.length;
					imlist = jChatList.slice(0,10);
					res.send({listSum: listSum,imlist: imlist}).end();
				}
			});
		}else if(school!='00'&&key==''){
			//某学校 无关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					listSum = jChatList.length;
					imlist = jChatList.slice(0,10);
					res.send({listSum: listSum,imlist: imlist}).end();
				}
			});
		}else if(school=='00'&&key!=''){
			//全部学校 关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE username LIKE '${key}%') a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					listSum = jChatList.length;
					imlist = jChatList.slice(0,10);
					res.send({listSum: listSum,imlist: imlist}).end();
				}
			});
		}else{
			//某学校 关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE username LIKE '${key}%' AND user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					listSum = jChatList.length;
					imlist = jChatList.slice(0,10);
					res.send({listSum: listSum,imlist: imlist}).end();
				}
			});
		}
		

	});
    router.post('/paging', (req, res)=>{
		var itemNum = req.body.showItem;
		    begin = req.body.listIndex*itemNum - itemNum;
		    key = req.body.key;
		if(school=='00'&&key==''){
			//全部学校 无关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid LIMIT ${begin},${itemNum}`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					imlist = jChatList;
					res.send({imlist: imlist}).end();
				}
			});
		}else if(school!='00'&&key==''){
			//某学校 无关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid LIMIT ${begin},${itemNum}`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					imlist = jChatList;
					res.send({imlist: imlist}).end();
				}
			});
		}else if(school=='00'&&key!=''){
			//全部学校 关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE username LIKE '${key}%') a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid LIMIT ${begin},${itemNum}`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					imlist = jChatList;
					res.send({imlist: imlist}).end();
				}
			});
		}else{
			//某学校 关键字
			db.query(`SELECT e.*,f.crowd FROM (SELECT c.*,d.friend FROM (SELECT a.*,b.msg FROM (SELECT id,username as account,sex,headimage,user_name as name FROM edu_users WHERE username LIKE '${key}%' AND user_school_id=${school}) a LEFT JOIN (SELECT send_uid,COUNT(send_uid) as msg FROM edu_im_message GROUP BY send_uid) b ON a.id=b.send_uid) c LEFT JOIN (SELECT uid1,COUNT(uid1) as friend FROM edu_im_connect_userfriend GROUP BY uid1) d ON c.id=d.uid1) e LEFT JOIN (SELECT uid,COUNT(uid) as crowd FROM edu_im_group_relation GROUP BY uid) f ON e.id=f.uid LIMIT ${begin},${itemNum}`, (err,jChatList)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jChatList = JSON.parse(JSON.stringify(jChatList));
					imlist = jChatList;
					res.send({imlist: imlist}).end();
				}
			});
		}
	});

	router.get('/', (req, res)=>{
		if(req.query.school){
			school = req.query.school;
		}else{
			school ='00';
		}
		res.render('im', {});
	});
	
	return router;
}