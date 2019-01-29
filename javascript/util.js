/**
 * 发起ajax请求
 * @param  {[String]} url    [description]
 * @param  {[string]} method [get/post]
 * @param  {[object]} data   [json-formated data]
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
					console.log("ajax request faild, response status code ：" + xhr.status)
					return "";
				}
			}
		}
	} else {  // syn
		data = null; 
		data = JSON.parse(xhr.responseText);
		return data;
	}
}


/**
 * 填充提示框的内容
 */
function createNoticeDiv() {
	var notice = document.getElementById("notice");

	var notice_innerHtml = "";
	notice_innerHtml += '<div id="notice_div">';
	notice_innerHtml += 	'<div id="notice_title"></div>';
	notice_innerHtml += 	'<div id="notice_info"></div>';
	notice_innerHtml += 	'<div id="notice_action">';
	notice_innerHtml += 		'<span id="notice_cancel" onclick="hideNotice()">Cancel</span>';
	notice_innerHtml += 		'<span id="notice_confirm" onclick="hideNotice()">Confirm</span>';
	notice_innerHtml += 	'</div>';
	notice_innerHtml += '</div>';
	
	notice.innerHTML = 	notice_innerHtml;
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
 * 获取用户的项目列表 并显示出来
 */
function getItemList() {
	var item_list = ajax("getitemList.php", "get", {});

	var item_tbody = document.getElementById("item_tbody");
	/*
	<tr class="item_item">
		<td>跑步</td>
		<td>2019-01-05</td>
		<td>5天</td>
		<td>
			<img src="./images/punch.png" onclick="punch_action(0, 5)" class="punch_action>
			<img src="./images/delete.png" onclick="deletePunchItem(0, 5)" class="delete_action" >
		</td>
	</tr>
	*/

	// 拼接
	var content = "";
	for (i = 0; i < item_list.length; i++) {
		content += '<tr class="item_item">';
		content += 		'<td>' + item_list[i]["item_name"] + '</td>';
		content += 		'<td>' + item_list[i]["start_date"] + '</td>';
		content += 		'<td>' + item_list[i]["consist"] + '天</td>';
		content += 		'<td>';
		content += 			'<img src="./images/delete.png" class="delete_action" onclick="deletePunchItem(' + i + ', ' + item_list[i]["id"] + ')">';
		content += 			'<img src="./images/punch.png" class="punch_action" onclick="punchAction(' + i + ', ' + item_list[i]["id"] + ')">';
		content += 		'</td>';
		content += '</tr>';
	}

	item_tbody.innerHTML = content;
}



/**
 * 将打卡的标志 切换为 删除图标
 */
function changeToDelete() {
	var punch_icons = document.getElementById("item_tbody").getElementsByClassName("punch_action");
	var delete_icons = document.getElementById("item_tbody").getElementsByClassName("delete_action");
	for (i = 0; i < punch_icons.length; i++) {
		punch_icons[i].style.display = "none";
		delete_icons[i].style.display = "inline";
	}
	document.getElementById("delete").style.display = "none";
	document.getElementById("cancel_delete").style.display = "table-cell";
}


/**
 * 将删除的图标 切换为 打卡图标
 */
function changeToPunch() {
	var punch_icons = document.getElementById("item_total").getElementsByClassName("punch_action");
	var delete_icons = document.getElementById("item_total").getElementsByClassName("delete_action");
	for (i = 0; i < punch_icons.length; i++) {
		punch_icons[i].style.display = "inline";
		delete_icons[i].style.display = "none";
	}

	document.getElementById("delete").style.display = "table-cell";
	document.getElementById("cancel_delete").style.display = "none";
}



/**
 * 进行打卡操作
 * @param {int} listid 		[该项在页面中的顺序]
 * @param {int} item_id
 */
function punchAction(list_id, item_id) {
	var result = ajax("punch.php", "post", {"item_id":item_id});
	if (result['flag']) {
		var item_consist = document.getElementById("item_tbody").getElementsByTagName("tr")[list_id].getElementsByTagName("td")[2];
		var old_record = parseInt(item_consist.innerHTML);
		old_record++;
		item_consist.innerHTML = old_record + "天";
		// showMessage("Cheer Up", "keep going");
	} else {
		showMessage("Punch faild", "please retry later");
	}
}


/**
 * 一次性为所有项目打卡
 */
function punchAll() {
	var item_list = document.getElementById("item_tbody").getElementsByTagName("tr");
	for (i = 0; i < item_list.length; i++) {
		var item_consist = item_list[i].getElementsByTagName("td")[2];
		var old_record = parseInt(item_consist.innerHTML);
		old_record++;
		item_consist.innerHTML = old_record + "天";
	}
	
	/**
	 * 发请求，一次性打卡
	 */
	//ajax("punchAll.php", "post", {});
}


/**
 * 添加item项目
 */
function addPunchItem() {
	var item_name = document.getElementById("item_name").value;
	var start_date = document.getElementById("start_date").value;

	if (item_name.replace(/\s/g, '').length == 0) {
		showMessage("Warning", "item name can't be empty");
		return;
	}
	var result = ajax("add.php", "post", {"item_name" : item_name, "start_date" : start_date});
	if (! result['flag']) { 
		showMessage("Add Item Failed", result['msg']);
	} else {
		// 跳转
		showMessage("Add successful", "This page will redirect in 2 second");
		location.href = "user.html";
	}
}


/**
 * 删除某一项（移除DOM，并发起请求）
 * @param {int} list_id 
 * @param {int} item_id 
 */
function deletePunchItem(list_id, item_id) {
	var parent = document.getElementById("item_tbody");
	var delete_item = parent.getElementsByTagName("tr")[list_id];

	var result = ajax("delete.php", "post", {"item_id" : item_id});

	if (result['flag']) {
		parent.removeChild(delete_item);
	} else {
		showMessage("Notice", result['msg']);
	}
}

window.onload = function() {
	createNoticeDiv();
}
