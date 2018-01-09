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
	router.post('/getNoteData', (req, res)=>{
		var data = {
			allschool: [],
	  		sunMsg: [
		  		{
		  			icon: 'file-text-o',
		  			num1: 0,
		  			title1: '新帖数／条',
		  			num2: 0,
		  			title2: '热门帖数／条'
		  		},
		  		{
		  			icon: 'commenting-o',
		  			num1: 0,
		  			title1: '评论总数／个',
		  			num2: 0,
		  			title2: '平均每日评论数／条'
		  		},
		  		{
		  			icon: 'thumbs-o-up',
		  			num1: 0,
		  			title1: '点赞总数／个',
		  			num2: 0,
		  			title2: '平均每日点赞数／个'
		  		},
		  		{
		  			icon: 'share-alt',
		  			num1: 0,
		  			title1: '分享总数／次',
		  			num2: 0,
		  			title2: '平均每日分享数／次'
		  		}
	  		],
	  		noteChart: {
	  			date: [],
	  			notes: []
	  		},
	  		noteLoopChart: [
	            {value:0, name:'点赞'},
	            {value:0, name:'评论'},
	            {value:0, name:'分享'}
	        ],
	  		topiclist: [],
	  		listSum: '',
  	    };
  	    //学校
		db.query(`SELECT id,name as school FROM edu_school`, (err,jSchool)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jSchool = JSON.parse(JSON.stringify(jSchool));
				data.allschool = jSchool;
				//一周内新帖数据统计表
				db.query(`SELECT COUNT(articleId) as newNote,SUM(thumbs) as thumbs,SUM(comments) as comments,SUM(shares) as shares FROM edu_qz_article WHERE createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(),INTERVAL 6 DAY))`, (err,jArticle)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jArticle = JSON.parse(JSON.stringify(jArticle));
						//新帖条数
						data.sunMsg[0].num1 = jArticle[0].newNote;
						//评论总数
						data.sunMsg[1].num1 = jArticle[0].comments;
						data.noteLoopChart[1].value = jArticle[0].comments;
						//点赞总数
						data.sunMsg[2].num1 = jArticle[0].thumbs;
						data.noteLoopChart[0].value = jArticle[0].thumbs;
						//分享总数
						data.sunMsg[3].num1 = jArticle[0].shares;
						data.noteLoopChart[2].value = jArticle[0].shares;
						//平均每日评论数
						data.sunMsg[1].num2 = Math.round(jArticle[0].comments/7);
						//平均点赞
						data.sunMsg[2].num2 = Math.round(jArticle[0].thumbs/7);
						//平均分享
						data.sunMsg[3].num2 = Math.round(jArticle[0].shares/7);

						//热门帖子数
						db.query(`SELECT COUNT(articleId) as hotNote FROM edu_qz_article WHERE createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(),INTERVAL 6 DAY)) AND thumbs+shares>10`, (err,jhotArticle)=>{
							if(err){
								res.status(500).send('database error').end();
						        console.log(err);
							}else{
								jhotArticle = JSON.parse(JSON.stringify(jhotArticle));
						        data.sunMsg[0].num2 = jhotArticle[0].hotNote;
						        //发帖折线图
						        db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m-%d") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 6 DAY))) a GROUP BY time`, (err,jArticleChart)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
										var week = [];
										for(let i = 0;i<7;i++){
											let addDate = new Date();
											addDate.setDate(addDate.getDate()-i);
											var formatDate = fFormatDate(addDate);
											week.unshift(formatDate);
										}
										data.noteChart.date = week;
										var note=[0,0,0,0,0,0,0];
										var oDL=jArticleChart.length;
										if(oDL==7){
											for(let i;i<7;i++){
												note[i] = jArticleChart[i].newArticle;
											}
										}else{
											for(let i = 0;i<oDL;i++){
												for(let y = 0;y<7;y++){
													if(jArticleChart[i].time==week[y]){
														note[y] = jArticleChart[i].newArticle;
													}
												}
											}
										}
										data.noteChart.notes = note;
										//话题列表
										db.query(`SELECT c.*,e.* FROM (SELECT a.id,a.keywords,a.summary,a.createdTime,a.articlenums,COUNT(b.id) as shares FROM edu_qz_topic a LEFT JOIN edu_qz_topicshare b ON a.id=b.topicId GROUP BY a.id) c LEFT JOIN (SELECT d.topicId,SUM(e.comments) as comments,SUM(e.thumbs) as thumbs FROM edu_qz_article_topic d JOIN edu_qz_article e GROUP BY d.topicId) e ON c.id=e.topicId ORDER BY c.id asc`, (err,jTopic)=>{
											if(err){
												res.status(500).send('database error').end();
										        console.log(err);
											}else{
												jTopic = JSON.parse(JSON.stringify(jTopic));
												data.topiclist = jTopic.slice(0,10);
												data.listSum = jTopic.length;
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

	router.post('/updateNoteData', (req, res)=>{
		var school = req.body.school;
		    beginDate = req.body.date.substring(0,10);
		    endDate = req.body.date.substring(13,23);
		    beginStamp = Date.parse(new Date(beginDate))/1000;
		    endStamp = (Date.parse(new Date(endDate))/1000)+(60*60*24-1);
		    //日期长度，31天内图表x轴以天为单位，31天以上365天以内以月为单位，再以上以年为单位
	        var bMonth = new Date(beginDate);
			    eMonth = new Date(endDate);
			    diffMonth = (eMonth.getFullYear()-bMonth.getFullYear())*12;
			diffMonth -= bMonth.getMonth();
			diffMonth += eMonth.getMonth()+1;

			var diffTime = endStamp+1-beginStamp;
			    diffDay = diffTime/(60*60*24);
		var data = {
  		  sunMsg: [
	  		{
	  			icon: 'file-text-o',
	  			num1: 0,
	  			title1: '新帖数／条',
	  			num2: 0,
	  			title2: '热门帖数／条'
	  		},
	  		{
	  			icon: 'commenting-o',
	  			num1: 0,
	  			title1: '评论总数／个',
	  			num2: 0,
	  			title2: '平均每日评论数／条'
	  		},
	  		{
	  			icon: 'thumbs-o-up',
	  			num1: 0,
	  			title1: '点赞总数／个',
	  			num2: 0,
	  			title2: '平均每日点赞数／个'
	  		},
	  		{
	  			icon: 'share-alt',
	  			num1: 0,
	  			title1: '分享总数／次',
	  			num2: 0,
	  			title2: '平均每日分享数／次'
	  		}
  		  ],
  		  noteChart: {
  			date: [],
  			notes: []
  		  },
  		  noteLoopChart: [
            {value:0, name:'点赞'},
            {value:0, name:'评论'},
            {value:0, name:'分享'}
          ]
  	    };
  	    if(school=='00'){
  	    	//全部学校
  	    	db.query(`SELECT COUNT(articleId) as newNote,SUM(thumbs) as thumbs,SUM(comments) as comments,SUM(shares) as shares FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}'`, (err,jArticle)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jArticle = JSON.parse(JSON.stringify(jArticle));
					//新帖条数
					data.sunMsg[0].num1 = jArticle[0].newNote;
					//评论总数
					data.sunMsg[1].num1 = jArticle[0].comments;
					data.noteLoopChart[1].value = jArticle[0].comments;
					//点赞总数
					data.sunMsg[2].num1 = jArticle[0].thumbs;
					data.noteLoopChart[0].value = jArticle[0].thumbs;
					//分享总数
					data.sunMsg[3].num1 = jArticle[0].shares;
					data.noteLoopChart[2].value = jArticle[0].shares;
					//平均每日评论数
					data.sunMsg[1].num2 = Math.round(jArticle[0].comments/diffDay);
					//平均点赞
					data.sunMsg[2].num2 = Math.round(jArticle[0].thumbs/diffDay);
					//平均分享
					data.sunMsg[3].num2 = Math.round(jArticle[0].shares/diffDay);

					//热门帖子数
					db.query(`SELECT COUNT(articleId) as hotNote FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND thumbs+shares>10`, (err,jhotArticle)=>{
						if(err){
							res.status(500).send('database error').end();
					        console.log(err);
						}else{
							jhotArticle = JSON.parse(JSON.stringify(jhotArticle));
					        data.sunMsg[0].num2 = jhotArticle[0].hotNote;
					        //发帖折线图
							
							if(diffTime<=2678400 && diffMonth<=2){
								//天
								let dataArrange = [];
								for(let i = 0;i<diffDay;i++){
									dataArrange.push(fFormatDate(beginStamp+(i*60*60*24)));
								}
								data.noteChart.date = dataArrange;
								db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m-%d") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jArticleChart)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
										var note=[];
										for(let i=0;i<diffDay;i++){
											note.push('0');
										}
										let oDL=jArticleChart.length;
										if(oDL==diffDay){
											for(let i;i<oDL;i++){
												note[i] = jArticleChart[i].newArticle;
											}
										}else{
											for(let i = 0;i<oDL;i++){
												for(let y = 0;y<diffDay;y++){
													if(jArticleChart[i].time==dataArrange[y]){
														note[y] = jArticleChart[i].newArticle;
													}
												}
											}
										}
										data.noteChart.notes = note;
										res.send(data).end();
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
								data.noteChart.date = dataArrange;
								db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jArticleChart)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
										var note=[];
										for(let i=0;i<diffYear;i++){
											note.push('0');
										}
										let oDL=jArticleChart.length;
										if(oDL==diffYear){
											for(let i;i<oDL;i++){
												note[i] = jArticleChart[i].newArticle;
											}
										}else{
											for(let i = 0;i<oDL;i++){
												for(let y = 0;y<diffYear;y++){
													if(jArticleChart[i].time==dataArrange[y]){
														note[y] = jArticleChart[i].newArticle;
													}
												}
											}
										}
										data.noteChart.notes = note;
										res.send(data).end();
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
								data.noteChart.date = dataArrange;
								db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}') a GROUP BY time`, (err,jArticleChart)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
										var note=[];
										for(let i=0;i<diffMonth;i++){
											note.push('0');
										}
										let oDL=jArticleChart.length;
										if(oDL==diffMonth){
											for(let i;i<oDL;i++){
												note[i] = jArticleChart[i].newArticle;
											}
										}else{
											for(let i = 0;i<oDL;i++){
												for(let y = 0;y<diffMonth;y++){
													if(jArticleChart[i].time==dataArrange[y]){
														note[y] = jArticleChart[i].newArticle;
													}
												}
											}
										}
										data.noteChart.notes = note;
										res.send(data).end();
									}
								});
							}
						}
					});
				}
			});

  	    }else{
  	    	//某个学校
  	    	db.query(`SELECT id FROM edu_users WHERE user_school_id='${school}'`, (err,jStudentId)=>{
				if(err){
					res.status(500).send('database error').end();
			        console.log(err);
				}else{
					jStudentId = JSON.parse(JSON.stringify(jStudentId));
					//该校学生的id
					if(jStudentId.length==0){
						//该校没有学生
						res.send(data).end();
					}else{
						var studentId = '';
						for(let i=0,l=jStudentId.length;i<l;i++){
							studentId += jStudentId[i].id + ',';
						}
						studentId = studentId.substring(0,studentId.length-1);
						db.query(`SELECT COUNT(articleId) as newNote,SUM(thumbs) as thumbs,SUM(comments) as comments,SUM(shares) as shares FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND UID in (${studentId})`, (err,jArticle)=>{
							if(err){
								res.status(500).send('database error').end();
						        console.log(err);
							}else{
								jArticle = JSON.parse(JSON.stringify(jArticle));
								//新帖条数
								data.sunMsg[0].num1 = jArticle[0].newNote;
								//评论总数
								data.sunMsg[1].num1 = jArticle[0].comments;
								data.noteLoopChart[1].value = jArticle[0].comments;
								//点赞总数
								data.sunMsg[2].num1 = jArticle[0].thumbs;
								data.noteLoopChart[0].value = jArticle[0].thumbs;
								//分享总数
								data.sunMsg[3].num1 = jArticle[0].shares;
								data.noteLoopChart[2].value = jArticle[0].shares;
								//平均每日评论数
								data.sunMsg[1].num2 = Math.round(jArticle[0].comments/diffDay);
								//平均点赞
								data.sunMsg[2].num2 = Math.round(jArticle[0].thumbs/diffDay);
								//平均分享
								data.sunMsg[3].num2 = Math.round(jArticle[0].shares/diffDay);

								//热门帖子数
								db.query(`SELECT COUNT(articleId) as hotNote FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND thumbs+shares>10 AND UID in (${studentId})`, (err,jhotArticle)=>{
									if(err){
										res.status(500).send('database error').end();
								        console.log(err);
									}else{
										jhotArticle = JSON.parse(JSON.stringify(jhotArticle));
								        data.sunMsg[0].num2 = jhotArticle[0].hotNote;
								        //发帖折线图
										
										if(diffTime<=2678400 && diffMonth<=2){
											//天
											let dataArrange = [];
											for(let i = 0;i<diffDay;i++){
												dataArrange.push(fFormatDate(beginStamp+(i*60*60*24)));
											}
											data.noteChart.date = dataArrange;
											db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m-%d") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND UID in (${studentId})) a GROUP BY time`, (err,jArticleChart)=>{
												if(err){
													res.status(500).send('database error').end();
											        console.log(err);
												}else{
													jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
													var note=[];
													for(let i=0;i<diffDay;i++){
														note.push('0');
													}
													let oDL=jArticleChart.length;
													if(oDL==diffDay){
														for(let i;i<oDL;i++){
															note[i] = jArticleChart[i].newArticle;
														}
													}else{
														for(let i = 0;i<oDL;i++){
															for(let y = 0;y<diffDay;y++){
																if(jArticleChart[i].time==dataArrange[y]){
																	note[y] = jArticleChart[i].newArticle;
																}
															}
														}
													}
													data.noteChart.notes = note;
													res.send(data).end();
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
											data.noteChart.date = dataArrange;
											db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND UID in (${studentId})) a GROUP BY time`, (err,jArticleChart)=>{
												if(err){
													res.status(500).send('database error').end();
											        console.log(err);
												}else{
													jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
													var note=[];
													for(let i=0;i<diffYear;i++){
														note.push('0');
													}
													let oDL=jArticleChart.length;
													if(oDL==diffYear){
														for(let i;i<oDL;i++){
															note[i] = jArticleChart[i].newArticle;
														}
													}else{
														for(let i = 0;i<oDL;i++){
															for(let y = 0;y<diffYear;y++){
																if(jArticleChart[i].time==dataArrange[y]){
																	note[y] = jArticleChart[i].newArticle;
																}
															}
														}
													}
													data.noteChart.notes = note;
													res.send(data).end();
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
											data.noteChart.date = dataArrange;
											db.query(`SELECT count(a.articleId)as newArticle,FROM_UNIXTIME(createdTime,"%Y-%m") as time FROM (SELECT articleId,createdTime FROM edu_qz_article WHERE createdTime>='${beginStamp}' AND createdTime<='${endStamp}' AND UID in (${studentId})) a GROUP BY time`, (err,jArticleChart)=>{
												if(err){
													res.status(500).send('database error').end();
											        console.log(err);
												}else{
													jArticleChart = JSON.parse(JSON.stringify(jArticleChart));
													var note=[];
													for(let i=0;i<diffMonth;i++){
														note.push('0');
													}
													let oDL=jArticleChart.length;
													if(oDL==diffMonth){
														for(let i;i<oDL;i++){
															note[i] = jArticleChart[i].newArticle;
														}
													}else{
														for(let i = 0;i<oDL;i++){
															for(let y = 0;y<diffMonth;y++){
																if(jArticleChart[i].time==dataArrange[y]){
																	note[y] = jArticleChart[i].newArticle;
																}
															}
														}
													}
													data.noteChart.notes = note;
													res.send(data).end();
												}
											});
										}
									}
								});
							}
						});
					}
					
				}
			});
  	    	//
  	    	
  	    }
  	    
	});
    router.post('/searchTable', (req, res)=>{
		var key = req.body.key;
		db.query(`SELECT c.*,e.* FROM (SELECT a.*,COUNT(b.id) as shares FROM (SELECT id,keywords,summary,createdTime,articlenums FROM edu_qz_topic WHERE keywords LIKE '%${key}%') a LEFT JOIN edu_qz_topicshare b ON a.id=b.topicId GROUP BY a.id) c LEFT JOIN (SELECT d.topicId,SUM(e.comments) as comments,SUM(e.thumbs) as thumbs FROM edu_qz_article_topic d JOIN edu_qz_article e GROUP BY d.topicId) e ON c.id=e.topicId ORDER BY c.id asc`, (err,jTopic)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jTopic = JSON.parse(JSON.stringify(jTopic));
				var listSum = jTopic.length;
				var topiclist = jTopic.slice(0,10);
				res.send({topiclist: topiclist,listSum: listSum}).end();
			}
		});

	});
    router.post('/paging', (req, res)=>{
		var itemNum = req.body.showItem;
		    begin = req.body.listIndex*itemNum - itemNum;
		db.query(`SELECT c.*,e.* FROM (SELECT a.id,a.keywords,a.summary,a.createdTime,a.articlenums,COUNT(b.id) as shares FROM edu_qz_topic a LEFT JOIN edu_qz_topicshare b ON a.id=b.topicId GROUP BY a.id) c LEFT JOIN (SELECT d.topicId,SUM(e.comments) as comments,SUM(e.thumbs) as thumbs FROM edu_qz_article_topic d JOIN edu_qz_article e GROUP BY d.topicId) e ON c.id=e.topicId ORDER BY c.id asc LIMIT ${begin},${itemNum}`, (err,jTopic)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jTopic = JSON.parse(JSON.stringify(jTopic));
				res.send({topiclist: jTopic}).end();
			}
		});
	});

	router.get('/', (req, res)=>{
		res.render('note', {});
	});
	//存储article ID
	var articleId = '';
	router.get('/article', (req, res)=>{
		articleId = req.query.id;
		res.render('article.html', {});
	});
    //
    router.post('/getArticleData', (req, res)=>{
    	var author = {};
    		article = {};
    		articleImg = [];
    		praisePeopleHead = [];
		db.query(`SELECT * FROM edu_qz_article WHERE articleId=${articleId}`, (err,jArticleInfo)=>{
			if(err){
				res.status(500).send('database error').end();
		        console.log(err);
			}else{
				jArticleInfo = JSON.parse(JSON.stringify(jArticleInfo));
				article.content = jArticleInfo[0].content;
				article.thumbs = jArticleInfo[0].thumbs;
				article.comments = jArticleInfo[0].comments;
				article.shares = jArticleInfo[0].shares;
				article.createdTime = jArticleInfo[0].createdTime;
				var articleImg = [];
				articleImg.push(jArticleInfo[0].image1,jArticleInfo[0].image2,jArticleInfo[0].image3,jArticleInfo[0].image4,jArticleInfo[0].image5,jArticleInfo[0].image6,jArticleInfo[0].image7,jArticleInfo[0].image8,jArticleInfo[0].image9);
				
				for(let i=0;i<articleImg.length;i++){
					if(articleImg[i]==null){
						articleImg.splice(i,1);
						i=i-1;
					}
				}
				articleImg = articleImg;
				//作者信息
				db.query(`SELECT a.user_name as name,a.headimage,a.sex,b.name as school FROM edu_users a JOIN edu_school b WHERE a.id=${jArticleInfo[0].UID} AND a.user_school_id=b.id`, (err,jAuthorInfo)=>{
					if(err){
						res.status(500).send('database error').end();
				        console.log(err);
					}else{
						jAuthorInfo = JSON.parse(JSON.stringify(jAuthorInfo));
						author = jAuthorInfo[0];
						//点赞人头像
						db.query(`SELECT a.headimage FROM edu_users a JOIN edu_qz_articlethumb b WHERE b.articleId=${articleId} AND a.id=b.UID LIMIT 9`, (err,jthumbImg)=>{
							if(err){
								res.status(500).send('database error').end();
						        console.log(err);
							}else{
								jthumbImg = JSON.parse(JSON.stringify(jthumbImg));
								for(let i=0,l=jthumbImg.length;i<l;i++){
									praisePeopleHead.push(jthumbImg[i].headimage);
								}
								res.send({author:author,article:article,articleImg:articleImg,praisePeopleHead:praisePeopleHead}).end();
							}
						});
					}
				});
			}
		});
	});
	return router;
}