const express=require('express');
const mysql=require('mysql');

var db = mysql.createPool({host: '10.60.10.88',user:'giedu', password:'123456', database:'giedu20171217'});

module.exports=function(){
	var router=express.Router();
	
	router.post('/getNoticeData', (req, res)=>{
		var data = {
			allschool: [],
	  		noticeSum: 0,
	  		noticelist: []
	  		
	  	};
	  	//学校select
	  	db.query(`SELECT id,name as school FROM edu_school`, (err,jSchool)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jSchool = JSON.parse(JSON.stringify(jSchool));
				data.allschool = jSchool;
				//学校通知列表 半年前
				var beginDate = new Date();
				beginDate.setMonth(beginDate.getMonth()-6);
  				beginDate.setDate(beginDate.getDate()+1);
  				var beginStamp = Date.parse(beginDate)/1000;
				db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND createdTime>=${beginStamp}`, (err,jNotice)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jNotice = JSON.parse(JSON.stringify(jNotice));
						data.noticelist = jNotice.slice(0,10);
						data.noticeSum = jNotice.length;
						res.send(data).end();
					}
				});
			}
		});
	});
	//记录搜索条件，以供分页使用
    var solution = 1;
    //默认半年前
    var before6m = new Date();
	before6m.setMonth(before6m.getMonth()-6);
  	before6m.setDate(before6m.getDate()+1);
    //以及搜索条件
    var school = '';
        beginStamp = Date.parse(before6m)/1000;
        endStamp = Date.parse(new Date())/1000;
        key = '';
    router.post('/updateNoticeData', (req, res)=>{
		school = req.body.school;
		var beginDate = req.body.date.substring(0,10);
		var endDate = req.body.date.substring(13,23);
		beginStamp = Date.parse(new Date(beginDate))/1000;
		endStamp = (Date.parse(new Date(endDate))/1000)+(60*60*24-1);
		key = req.body.key;

		var data = {
	  		noticeSum: 0,
	  		noticelist: []
	  	};
	  	if(key==''&&school=='00'){
	  		//无关键字 全部学校
	  		solution = 1;
	  		db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,jNotice)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jNotice = JSON.parse(JSON.stringify(jNotice));
					data.noticelist = jNotice.slice(0,10);
					data.noticeSum = jNotice.length;
					res.send(data).end();
				}
			});
	  	}else if(key==''&&school!='00'){
	  		//无关键字 某学校
	  		solution = 2;
	  		db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND b.id='${school}' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,jNotice)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jNotice = JSON.parse(JSON.stringify(jNotice));
					data.noticelist = jNotice.slice(0,10);
					data.noticeSum = jNotice.length;
					res.send(data).end();
				}
			});
	  	}else if(key!=''&&school=='00'){
	  		//有关键字 全部学校
	  		solution = 3;
	  		db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND a.title like '%${key}%' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,jNotice)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jNotice = JSON.parse(JSON.stringify(jNotice));
					data.noticelist = jNotice.slice(0,10);
					data.noticeSum = jNotice.length;
					res.send(data).end();
				}
			});
	  	}else{
	  		//有关键字 某学校
	  		solution = 4;
	  		db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND b.id='${school}' AND a.title like '%${key}%' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,jNotice)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jNotice = JSON.parse(JSON.stringify(jNotice));
					data.noticelist = jNotice.slice(0,10);
					data.noticeSum = jNotice.length;
					res.send(data).end();
				}
			});
	  	}
	});
	router.post('/paging', (req, res)=>{
		var itemNum = req.body.showItem;
		    begin = req.body.listIndex*itemNum - itemNum;
		switch(solution){
			case 1:
			    db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}' LIMIT ${begin},${itemNum}`, (err,jNotice)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jNotice = JSON.parse(JSON.stringify(jNotice));
						var noticelist = jNotice;
						console.log(noticelist);
						res.send({noticelist:noticelist}).end();
					}
				});
			    break;
			case 2:
			    db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND b.id='${school}' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}' LIMIT ${begin},${itemNum}`, (err,jNotice)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jNotice = JSON.parse(JSON.stringify(jNotice));
						var noticelist = jNotice;
						res.send({noticelist:noticelist}).end();
					}
				});
			    break;
			case 3:
			    db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND a.title like '%${key}%' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}' LIMIT ${begin},${itemNum}`, (err,jNotice)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jNotice = JSON.parse(JSON.stringify(jNotice));
						var noticelist = jNotice;
						res.send({noticelist:noticelist}).end();
					}
				});
			    break;
			case 4:
			    db.query(`SELECT a.schoolId,a.title,a.content,a.createdTime,b.name as school FROM edu_notice_s a JOIN edu_school b WHERE a.schoolId=b.id AND b.id='${school}' AND a.title like '%${key}%' AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}' LIMIT ${begin},${itemNum}`, (err,jNotice)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jNotice = JSON.parse(JSON.stringify(jNotice));
						var noticelist = jNotice;
						res.send({noticelist:noticelist}).end();
					}
				});
			    break;
		}
	});
	router.get('/', (req, res)=>{
		res.render('notice', {});
	});

	return router;
}