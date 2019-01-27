
/**
 * 发起ajax请求
 * @param  {[String]} url    [description]
 * @param  {[object]} data   [description]
 * @param  {[string]} method [get/post]
 * @return {[object]}        [description]
 */
function ajax(url, method, data, asyn = false) {
	var xhr = new XMLHttpRequest();

	var fd = new FormData();
	for (key in data) {
		fd.set(key,data[key]);
	}
	xhr.open(method, url, asyn);
	xhr.send(fd);
	if (asyn) {
		xhr.onreadystatechange = function(){
			if(xhr.readyState==4){
				if((xhr.status==200 && xhr.status<300) || xhr.status==304){
					
				} else {
					console.log("请求失败，响应码：" + xhr.status)
					return "";
				}
			}
		}
	} else {  // 采用同步方式
		data = null; 
		data = JSON.parse(xhr.responseText);
		return data;
	}
}

/**
 * 显示提示框，并且打印提示信息
 * @param {string} title 
 * @param {string} info 
 */
function showMessage(title, info) {
	var notice = document.getElementById("notice");

	var notice_title = document.getElementById("notice_title");
	var notice_info = document.getElementById("notice_info");

	notice_title.innerHTML = title;
	notice_info.innerHTML = info;

	notice.style.display = "block";

}

/**
 * 隐藏提示框
 */
function hideNotice() {
	var notice = document.getElementById("notice");
	notice.style.display = "none";
}

/**
 * 登陆操作
 */
function login() {
    var data = {
        "username" : document.getElementById("login_username").value,
        "password" : document.getElementById("login_password").value
    }
    var result = ajax("login.php", "post", data );
    console.log(result);

    if (! result["flag"]) {
        showMessage("Warning", "Login Failed <br> Wrong Username or Password");
    }
}

/**
 * 隐藏登录页，并显示注册页
 */
function showRegisterPage() {
	document.getElementById("index_div").style.display="none";
	document.getElementById("register_div").style.display="block";
}

/**
 * 查询用户是否已存在（注册时）
 */
function checkUserExists() {
	var username = document.getElementById("reg_username").value;

	if (username.replace(/\s/g, "").length == 0) {
		showMessage("Warning", "Username can't be empty");
		return;
	} else if (username.match(" ")) {
		showMessage("Warning", "Username can't contain blank character");
	} else {
		var result = ajax("checkUser.php", "post", {"username" : username});
		if (result['exists']) {
			showMessage("Notice", "the username already exists");
		}
	}
}


/**
 * 进行注册
 */
function register() {
	var username = document.getElementById("reg_username").value;
	var password = document.getElementById("reg_password").value;
	var confirm_password = document.getElementById("reg_confirm_password").value;

	
	if (username.replace(/\s/g, "").length == 0) {
		showMessage("Register Failed", "Username can't be empty");
		return;
	}

	if (username.match(" ")) {
		showMessage("Register Failed", "Username can't contain blank character");
		return;
	}

	if (password.replace(/\s/g, "").length == 0) {
		showMessage("Register Failed", "password can't be empty");
		return;
	}

	if (password.match(" ")) {
		showMessage("Register Failed", "Password can't contain blank character");
		return;
	}

	if (password != confirm_password) {
		showMessage("Register Failed", "The password and confirmation don't match");
		return;
	}

	var data = {
        "username" : username,
		"password" : password
	};

	var result = ajax("register.php", "post", data);

	if (result['flag']) {
		showMessage("Congratulation", "register successful");
	} else {
		showMessage("Register Failed", result['msg']);
	}
}

/**
 * 为每一个打卡图片，绑定打卡事件
 */
function punch() {

}


/**
 * 将打卡的标志 切换为 删除图标
 */
function changeToDelele() {
	var imgList = document.getElementById("project_total").getElementsByTagName("img");
	for (i = 0; i < imgList.length; i++) {
		imgList[i]["src"]= "./images/delete.png";
		imgList[i].className = "delete_action";
	}
	this.id = "cancel_delete";
	this.innerHTML = "Cancel to delete";

	this.onclick = changeToPunch;
}


/**
 * 将删除的图标 切换为 打卡图标
 */
function changeToPunch() {
	var imgList = document.getElementById("project_total").getElementsByTagName("img");
	for (i = 0; i < imgList.length; i++) {
		imgList[i]["src"]= "./images/punch.png";
		imgList[i].className = "punch_action";
	}
	this.id = "delete";
	this.innerHTML = "Delete Punch";

	this.onclick = changeToDelele;
}

/**
 * 为所有的打卡图标添加事件
 */
function addPunchAction() {
	project_id = this.project_id;

	var result = ajax("punch.php", "post", {"project_id":project_id});
	if (result['flag']) {
		showMessage("Cheer Up", "keep going")
	} else {
		showMessage("Punch faild", "please retry later");
	}
}