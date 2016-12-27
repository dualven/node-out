//定义获取对象的方法
function getObj(id) {
  return document.getElementById(id);
}
var itemPic = getObj("item_pic");
var filesInput = getObj("filesInput"),
  info = getObj("info"),
  imageBox = getObj("imageBox"),
  btnUpload = getObj("btnUpload"),
  removeFile = getObj("removeFile");
//定义存放图片对象的数组
var uploadImgArr = [];

var IS_EDIT = jQuery('#is_edit').val();
if(IS_EDIT == '1'){
	uploadImgArr.push(1);
}

//防止图片上传完成后，再点击上传按钮的时候重复上传图片
var isUpload = false;
//定义获取图片信息的函数
function getFiles(e) {
	if(uploadImgArr.length > 0){
		alert('只允许上传一张图片');
		return;
	}
	
  isUpload = false;
  e = e || window.event;
  //获取file input中的图片信息列表
  var files = e.target.files,
  //验证是否是图片文件的正则
  reg = /image\/.*/i;
  
  for (var i = 0,f; f = files[i]; i++) {
      //把这个if判断去掉后，也能上传别的文件
      if (!reg.test(f.type)) {
          imageBox.innerHTML = "<li>你选择的" + f.name + "文件不是图片</li>";
          //跳出循环
          continue;
      }
      //console.log(f);
      uploadImgArr.push(f);
      var reader = new FileReader();
      //类似于原生JS实现tab一样（闭包的方法），参见http://www.css119.com/archives/1418
      reader.onload = (function(file) {
          //获取图片相关的信息
          var fileSize = (file.size / 1024).toFixed(2) + "K",
          fileName = file.name,
          fileType = file.type;
          //console.log(fileName)
          return function(e) {
              //console.log(e.target)
              //获取图片的宽高
              var img = new Image();
              img.addEventListener("load", imgLoaded, false);
              img.src = e.target.result;
              function imgLoaded() {
                  imgWidth = img.width;
                  imgHeight = img.height;
                  //图片加载完成后才能获取imgWidth和imgHeight
                  //imageBox.innerHTML = "<li><img src='" + e.target.result + "' alt='" + fileName + "' title='" + fileName + "'> 图片名称是：" + fileName + ";图片的的大小是：" + fileSize + ";图片的类型是：" + fileType + ";图片的尺寸是：" + imgWidth + " X " + imgHeight + "</li>";
                  imageBox.innerHTML = "<li><img src='" + e.target.result + "' alt='" + fileName + "' title='" + fileName + "'><br /><a href='javascript:;;' onclick='removeFileFun(this, 0);'>删除</a></li>";
                  if(removeFile != null){
                		console.log('removeFile != null');
                		removeFile.addEventListener("click", removeFileFun, false);
                	}
              }
          }
      })(f);
      //读取文件内容
      reader.readAsDataURL(f);
  }
  //console.log(uploadImgArr);
}

if (window.File && window.FileList && window.FileReader && window.Blob) {
  filesInput.addEventListener("change", getFiles, false);
} else {
  info.innerHTML = "您的浏览器不支持HTML5长传";
  info.className="tips";
}

// 删除文件: type=0未上传的，1已经上传过的-编辑时使用
function removeFileFun(obj, type){
	uploadImgArr = [];
	obj.parentNode.remove();
} 

//开始上传照片
function uploadFun() {
  var j = 0;
  function fun() {
      if (uploadImgArr.length > 0 && !isUpload) {
          var singleImg = uploadImgArr[j];
          var xhr = new XMLHttpRequest();
          if (xhr.upload) {
              
              // 文件上传成功或是失败
              xhr.onreadystatechange = function(e) {
                  if (xhr.readyState == 4) {
                	  if (xhr.status == 200 && eval("(" + xhr.responseText + ")").status == true) {
                          info.innerHTML += singleImg.name + "上传完成; ";
                          itemPic.value = eval("(" + xhr.responseText + ")").url
                          isUpload = true;
                      } else {
                          info.innerHTML += singleImg.name + "上传失败; ";
                          itemPic.value = '';
                      }
                      //上传成功（或者失败）一张后，再次调用fun函数，模拟循环
                      if (j < uploadImgArr.length - 1) {
                          j++;
                          isUpload = false;
                          fun();
                      }
                  }
              };
              var formdata = new FormData();
              formdata.append("FileData", singleImg);
              // 开始上传
              var UPLOAD_URL = jQuery('#upload_url').val();
              xhr.open("POST", UPLOAD_URL, true);
              xhr.send(formdata);
              var startDate = new Date().getTime();
          }
      }
  }
  fun();
}
btnUpload.addEventListener("click", uploadFun, false);