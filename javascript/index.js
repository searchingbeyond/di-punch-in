
/**
 * 为index.html中的按钮绑定对应的事件处理程序
 */

 /**
  * 取消弹窗
  */
var notice_cancel = document.getElementById("notice_cancel");
notice_cancel.onclick = hideNotice;

/**
 * 登录操作
 */
var btn_login = document.getElementById("login");
btn_login.onclick = login;

/**
 * 显示注册页面
 */
var btn_reg = document.getElementById("reg_href");
btn_reg.onclick = showRegisterPage;

/**
 * 注册时，判断用户是否已经存在
 */
var reg_username = document.getElementById("reg_username");
reg_username.onblur = checkUserExists;

/**
 * 进行注册
 */
var reg_username = document.getElementById("register");
reg_username.onclick = register;