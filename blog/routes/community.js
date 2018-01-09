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
	router.post('/getData', (req, res)=>{
		var data = {
	  		sunMsg: [
		  		{
		  			icon: 'globe',
		  			num1: '',
		  			title1: '新增圈子数／个',
		  			num2: '',
		  			title2: '圈子总数／个'
		  		},
		  		{
		  			icon: 'user-circle-o',
		  			num1: '',
		  			title1: '平均每圈子成员数／人',
		  			num2: '',
		  			title2: '圈子成员总数／人'
		  		},
		  		{
		  			icon: 'file-text-o',
		  			num1: '',
		  			title1: '平均每圈子帖子数／个',
		  			num2: '',
		  			title2: '圈内帖子总数／个'
		  		}
	  		],
	  		activeChart: {
	  			date: [],
	  			article: [],
	  			comment: []
	  		},
	  		circlelist: [],
	  		listSum: '',
	  		
	  	};
	  	db.query('SELECT y.*,d.name as creatorSchool FROM (SELECT x.*,c.headimage as creatorHead,c.user_name as creatorName,c.sex as creatorSex,c.user_school_id FROM (SELECT a.*,b.* FROM edu_qz_circle a LEFT JOIN (SELECT circleId,SUM(thumbs) as thumbsum,SUM(shares) as sharesum,SUM(comments) as commentsum FROM edu_qz_article GROUP BY circleId) b ON a.id = b.circleId) x LEFT JOIN edu_users c ON x.adminUID = c.id) y LEFT JOIN edu_school d ON y.user_school_id = d.id ORDER BY y.id asc', (err,circleform)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				circleform = JSON.parse(JSON.stringify(circleform));
				let l = circleform.length;
				
				//圈子列表
				data.circlelist = circleform.slice(0,10);
				//圈子总数
				data.sunMsg[0].num2 = l;
				data.listSum = l;
				//圈子成员总数
				var memsum = 0;
				for(var i=0;i<l;i++){
					memsum += circleform[i].memberNum;
				}
				data.sunMsg[1].num2 = memsum;
				data.sunMsg[1].num1 = Math.round(memsum/l);

				//圈子帖子总数
				var artsum = 0;
				for(var i=0;i<l;i++){
					artsum += circleform[i].articleNum;
				}
				data.sunMsg[2].num2 = artsum;
				data.sunMsg[2].num1 = Math.round(artsum/l);

				//新增圈子数
				db.query('SELECT count(1) FROM edu_qz_circle WHERE createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(),INTERVAL 6 DAY))', (err,newcirclenum)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						data.sunMsg[0].num1 = JSON.parse(JSON.stringify(newcirclenum))[0]['count(1)'];

						//圈子活跃度折线图数据
						var week = [];
						for(let i = 0;i<7;i++){
							let addDate = new Date();
							addDate.setDate(addDate.getDate()-i);
							var formatDate = fFormatDate(addDate);
							week.unshift(formatDate);
						}
						data.activeChart.date = week;
						//帖子数据
						db.query('SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m-%d") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE circleId IS NOT NULL AND createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY))) a GROUP BY time', (err,originalDate)=>{
							if(err){
								res.status(500).send('database error').end();
						        console.log(err);
							}else{
								originalDate = JSON.parse(JSON.stringify(originalDate));
								var article=[0,0,0,0,0,0,0];
								var oDL=originalDate.length;
								if(oDL==7){
									for(let i;i<7;i++){
										article[i] = originalDate[i].newArticle;
									}
								}else{
									for(let i = 0;i<oDL;i++){
										for(let y = 0;y<7;y++){
											if(originalDate[i].time==week[y]){
												article[y] = originalDate[i].newArticle;
											}
										}
									}
								}
								data.activeChart.article = article;
								//评论数据
								db.query('SELECT articleId FROM edu_qz_article WHERE circleId IS NOT NULL', (err,jArticleId)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jArticleId = JSON.parse(JSON.stringify(jArticleId));
										aArticleId = '';
										for(let i = 0,l=jArticleId.length;i<l;i++){
											aArticleId += jArticleId[i].articleId+',';
										}
										aArticleId = aArticleId.substring(0,aArticleId.length-1);
										
										db.query(`SELECT count(a.id)as countComment ,FROM_UNIXTIME(createdTime, '%Y-%m-%d') as time FROM (SELECT id,createdTime FROM edu_qz_comments WHERE articleId IN (${aArticleId}) AND createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY))) a GROUP BY time`, (err,jComment)=>{
											if(err){
												res.status(500).send('database error').end();
										        console.log(err);
											}else{
												jComment = JSON.parse(JSON.stringify(jComment));
												var comment=[0,0,0,0,0,0,0];
												var jCL=jComment.length;
												if(jCL==7){
													for(let i;i<7;i++){
														comment[i] = jComment[i].countComment;
													}
												}else{
													for(let i = 0;i<jCL;i++){
														for(let x = 0;x<7;x++){
															if(jComment[i].time==week[x]){
																comment[x] = jComment[i].countComment;
															}
														}
													}
												}
												data.activeChart.comment = comment;
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
  	    
	});

	router.post('/updateChart', (req, res)=>{

		var beginDate = req.body.date.substring(0,10);
		    endDate = req.body.date.substring(13,23);
		    beginStamp = Date.parse(new Date(beginDate))/1000;
		    endStamp = (Date.parse(new Date(endDate))/1000)+(60*60*24-1);

		var data = {
	  		newcirclenum: '',
	  		activeChart: {
	  			date: [],
	  			article: [],
	  			comment: []
	  		}
	  	};
        //新增圈子数
	  	db.query(`SELECT count(1) FROM edu_qz_circle WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,newcirclenum)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				data.newcirclenum = JSON.parse(JSON.stringify(newcirclenum))[0]['count(1)'];
				//圈子活跃度
				//日期长度，31天内图表x轴以天为单位，31天以上365天以内以月为单位，再以上以年为单位
				var bMonth = new Date(beginDate);
				    eMonth = new Date(endDate);
				    diffMonth = (eMonth.getFullYear()-bMonth.getFullYear())*12;
				diffMonth -= bMonth.getMonth();
				diffMonth += eMonth.getMonth()+1;

				var diffTime = endStamp+1-beginStamp;
				
				if(diffTime<=2678400 && diffMonth<=2){
					//天
					let diffDay = diffTime/(60*60*24);
					    dataArrange = [];
					for(let i = 0;i<diffDay;i++){
						dataArrange.push(fFormatDate(beginStamp+(i*60*60*24)));
					}
					data.activeChart.date = dataArrange;
					//帖子数据
					db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m-%d") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE circleId IS NOT NULL AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,originalDate)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							originalDate = JSON.parse(JSON.stringify(originalDate));
							var article=[];
							var comment=[];
							for(let i=0;i<diffDay;i++){
								article.push('0');
								comment.push('0');
							}
							var oDL=originalDate.length;
							
							if(oDL==diffDay){
								for(let i;i<oDL;i++){
									article[i] = originalDate[i].newArticle;
								}
							}else{
								for(let i = 0;i<oDL;i++){
									for(let y = 0;y<diffDay;y++){
										if(originalDate[i].time==dataArrange[y]){
											article[y] = originalDate[i].newArticle;
										}
									}
								}
							}
							data.activeChart.article = article;
							//评论数据
							db.query('SELECT articleId FROM edu_qz_article WHERE circleId IS NOT NULL', (err,jArticleId)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jArticleId = JSON.parse(JSON.stringify(jArticleId));
									aArticleId = '';
									for(let i = 0,l=jArticleId.length;i<l;i++){
										aArticleId += jArticleId[i].articleId+',';
									}
									aArticleId = aArticleId.substring(0,aArticleId.length-1);
									db.query(`SELECT count(a.id)as countComment ,FROM_UNIXTIME(createdTime, '%Y-%m-%d') as time FROM (SELECT id,createdTime FROM edu_qz_comments WHERE articleId IN (${aArticleId}) AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jComment)=>{
										if(err){
											res.status(500).send('database error').end();
									        console.log(err);
										}else{
											jComment = JSON.parse(JSON.stringify(jComment));
											var jCL=jComment.length;
											if(jCL==diffDay){
												for(let i;i<oDL;i++){
													comment[i] = jComment[i].countComment;
												}
											}else{
												for(let i = 0;i<jCL;i++){
													for(let x = 0;x<diffDay;x++){
														if(jComment[i].time==dataArrange[x]){
															comment[x] = jComment[i].countComment;
														}
													}
												}
											}
											data.activeChart.comment = comment;
											res.send(data).end();
										}
									});
								}
							});
						}
					});

				}else if(diffTime>31536000 && diffMonth>12){
					//年
					var bYear = new Date(beginDate);
					    eYear = new Date(endDate);
					    diffYear = eYear.getFullYear() - bYear.getFullYear() + 1;
					    dataArrange = [];
					for(let i = 0;i<diffYear;i++){
						dataArrange.push(bYear.getFullYear()+i);
					}
					data.activeChart.date = dataArrange;
					//帖子数据
					db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE circleId IS NOT NULL AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,originalDate)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							originalDate = JSON.parse(JSON.stringify(originalDate));
							var article=[];
							var comment=[];
							for(let i=0;i<diffYear;i++){
								article.push('0');
								comment.push('0');
							}
							var oDL=originalDate.length;
							
							if(oDL==diffYear){
								for(let i;i<oDL;i++){
									article[i] = originalDate[i].newArticle;
								}
							}else{
								for(let i = 0;i<oDL;i++){
									for(let y = 0;y<diffYear;y++){
										if(originalDate[i].time==dataArrange[y]){
											article[y] = originalDate[i].newArticle;
										}
									}
								}
							}
							data.activeChart.article = article;
							//评论数据
							db.query('SELECT articleId FROM edu_qz_article WHERE circleId IS NOT NULL', (err,jArticleId)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jArticleId = JSON.parse(JSON.stringify(jArticleId));
									aArticleId = '';
									for(let i = 0,l=jArticleId.length;i<l;i++){
										aArticleId += jArticleId[i].articleId+',';
									}
									aArticleId = aArticleId.substring(0,aArticleId.length-1);
									db.query(`SELECT count(a.id)as countComment ,FROM_UNIXTIME(createdTime, '%Y') as time FROM (SELECT id,createdTime FROM edu_qz_comments WHERE articleId IN (${aArticleId}) AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jComment)=>{
										if(err){
											res.status(500).send('database error').end();
									        console.log(err);
										}else{
											jComment = JSON.parse(JSON.stringify(jComment));
											var jCL=jComment.length;
											if(jCL==diffYear){
												for(let i;i<oDL;i++){
													comment[i] = jComment[i].countComment;
												}
											}else{
												for(let i = 0;i<jCL;i++){
													for(let x = 0;x<diffYear;x++){
														if(jComment[i].time==dataArrange[x]){
															comment[x] = jComment[i].countComment;
														}
													}
												}
											}
											data.activeChart.comment = comment;
											res.send(data).end();
										}
									});
								}
							});
						}
					});
				}else{
					//月

					let dataArrange = [];
					for(let i = 0;i<diffMonth;i++){
						let addMonth = new Date(bMonth);
						addMonth.setMonth(bMonth.getMonth()+i);
						let y = addMonth.getFullYear();
						let m = addMonth.getMonth() + 1;  
						m = m < 10 ? '0' + m : m;
						dataArrange.push(y + '-' + m);
					}
					data.activeChart.date = dataArrange;
					//帖子数据
					db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE circleId IS NOT NULL AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,originalDate)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							originalDate = JSON.parse(JSON.stringify(originalDate));
							var article=[];
							var comment=[];
							for(let i=0;i<diffMonth;i++){
								article.push('0');
								comment.push('0');
							}
							var oDL=originalDate.length;
							
							if(oDL==diffMonth){
								for(let i;i<oDL;i++){
									article[i] = originalDate[i].newArticle;
								}
							}else{
								for(let i = 0;i<oDL;i++){
									for(let y = 0;y<diffMonth;y++){
										if(originalDate[i].time==dataArrange[y]){
											article[y] = originalDate[i].newArticle;
										}
									}
								}
							}
							data.activeChart.article = article;
							//评论数据
							db.query('SELECT articleId FROM edu_qz_article WHERE circleId IS NOT NULL', (err,jArticleId)=>{
								if(err){
									res.status(500).send('database error').end();
							        console.log(err);
								}else{
									jArticleId = JSON.parse(JSON.stringify(jArticleId));
									aArticleId = '';
									for(let i = 0,l=jArticleId.length;i<l;i++){
										aArticleId += jArticleId[i].articleId+',';
									}
									aArticleId = aArticleId.substring(0,aArticleId.length-1);
									db.query(`SELECT count(a.id)as countComment ,FROM_UNIXTIME(createdTime, '%Y-%m') as time FROM (SELECT id,createdTime FROM edu_qz_comments WHERE articleId IN (${aArticleId}) AND createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jComment)=>{
										if(err){
											res.status(500).send('database error').end();
									        console.log(err);
										}else{
											jComment = JSON.parse(JSON.stringify(jComment));
											var jCL=jComment.length;
											if(jCL==diffMonth){
												for(let i;i<oDL;i++){
													comment[i] = jComment[i].countComment;
												}
											}else{
												for(let i = 0;i<jCL;i++){
													for(let x = 0;x<diffMonth;x++){
														if(jComment[i].time==dataArrange[x]){
															comment[x] = jComment[i].countComment;
														}
													}
												}
											}
											data.activeChart.comment = comment;
											res.send(data).end();
										}
									});
								}
							});
						}
					});
				}
			}
		});
	});

	router.post('/searchTable', (req, res)=>{
		var key = req.body.key;
		db.query(`SELECT y.*,d.name as creatorSchool FROM (SELECT x.*,c.headimage as creatorHead,c.user_name as creatorName,c.sex as creatorSex,c.user_school_id FROM (SELECT a.*,b.* FROM (SELECT * FROM edu_qz_circle WHERE name LIKE '%${key}%') a LEFT JOIN (SELECT circleId,SUM(thumbs) as thumbsum,SUM(shares) as sharesum,SUM(comments) as commentsum FROM edu_qz_article GROUP BY circleId) b ON a.id = b.circleId) x LEFT JOIN edu_users c ON x.adminUID = c.id) y LEFT JOIN edu_school d ON y.user_school_id = d.id ORDER BY y.id asc`, (err,circleform)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				circleform = JSON.parse(JSON.stringify(circleform));
				//圈子列表
				var listSum = circleform.length;
				var circlelist = circleform.slice(0,10);
				res.send({circlelist: circlelist,listSum: listSum}).end();
			}
		});

	});

	router.get('/', (req, res)=>{

		res.render('community', {});
	});
    var circleId = 0;
	router.get('/detail', (req, res)=>{
		circleId = req.query.id;
		res.render('circle', {});
	});
	router.post('/getDetailData', (req, res)=>{
		var circleInfo = {};
			sunNotes = [
			  {
		  		managerheadimg: './image/userhead/1.png',
		  		managername: '好想有颗糖',
		  		managerschool: '东华大学',
		  		managersex: 'boy',
			  	creatdate: '5小时前',
			  	content: '今天度天气真呀真正好。开心',
			  	picture: [
			  		'./image/notepic/1.png',
			  		'./image/notepic/2.png',
			  		'./image/notepic/3.png',
			  		'./image/notepic/1.png',
			  		'./image/notepic/2.png',
			  		'./image/notepic/3.png',
			  		'./image/notepic/1.png',
			  		'./image/notepic/2.png',
			  		'./image/notepic/3.png',
			  	],
			  	praise: '345',
			  	comment: '12',
	  		    share: '456',
			  },
			];
		
		db.query(`SELECT a.*,b.*,c.headimage as creatorHead,c.user_name as creatorName,c.sex as creatorSex,c.user_school_id,d.name as creatorSchool FROM edu_qz_circle a JOIN (SELECT circleId,SUM(thumbs) as thumbsum,SUM(shares) as sharesum FROM edu_qz_article GROUP BY circleId) b JOIN edu_users c JOIN edu_school d WHERE a.id=${circleId} AND a.id = b.circleId AND a.adminUID = c.id AND c.user_school_id = d.id`, (err,jCircleInfo)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jCircleInfo = JSON.parse(JSON.stringify(jCircleInfo));
				circleInfo = jCircleInfo[0];
				db.query(`SELECT a.headimage FROM edu_users a join edu_qz_circle_user b WHERE b.circleId=${circleId} AND b.UID=a.id LIMIT 10`, (err,jCircleMember)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jCircleMember = JSON.parse(JSON.stringify(jCircleMember));
						let arr = [];
						for(let i=0,l=jCircleMember.length;i<l;i++){
							arr.push(jCircleMember[i].headimage);
						}
						circleInfo.memberHead = arr;
						db.query(`SELECT a.*,c.headimage as authorHead,c.user_name as authorName,c.sex as authorSex,c.user_school_id,d.name as authorSchool FROM edu_qz_article a JOIN edu_users c JOIN edu_school d WHERE a.circleId=${circleId} AND a.UID=c.id AND c.user_school_id=d.id`, (err,articleList)=>{
							if(err){
								res.status(500).send('database error').end();
						        console.log(err);
							}else{
								articleList = JSON.parse(JSON.stringify(articleList));
								sunNotes = articleList;
								res.send({circleInfo:circleInfo,sunNotes:sunNotes}).end();
							}
						});
					}
				});
			}
		});
	});
	router.post('/paging', (req, res)=>{
		var itemNum = req.body.showItem;
		    begin = req.body.listIndex*itemNum - itemNum;
		db.query(`SELECT y.*,d.name as creatorSchool FROM (SELECT x.*,c.headimage as creatorHead,c.user_name as creatorName,c.sex as creatorSex,c.user_school_id FROM (SELECT a.*,b.* FROM edu_qz_circle a LEFT JOIN (SELECT circleId,SUM(thumbs) as thumbsum,SUM(shares) as sharesum,SUM(comments) as commentsum FROM edu_qz_article GROUP BY circleId) b ON a.id = b.circleId) x LEFT JOIN edu_users c ON x.adminUID = c.id) y LEFT JOIN edu_school d ON y.user_school_id = d.id ORDER BY y.id asc LIMIT ${begin},${itemNum}`, (err,circleform)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				circleform = JSON.parse(JSON.stringify(circleform));
				res.send({circlelist: circleform}).end();
			}
		});
	});

	return router;
}