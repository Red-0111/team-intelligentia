function HashPass() {
    var salt = document.getElementById('ContentPlaceHolder1_lgn_hdnRandomString').value;
    var idNewPwd = document.getElementById('ContentPlaceHolder1_lgn_txtpass').value;
    document.getElementById('ContentPlaceHolder1_lgn_txtpass').value = "******************";
    var id2NewPwd = hex_md5(String(idNewPwd + "d2f*jk#g&h"));
    document.getElementById('ContentPlaceHolder1_lgn_hdnprevpwd').value = id2NewPwd;
    var id3NewPwd = hex_md5(String(id2NewPwd + salt));
    document.getElementById('ContentPlaceHolder1_lgn_hdnsetpassowrd').value = id3NewPwd;
}

function NewHashPass() {
    var idNewPwd = document.getElementById('txtpass').value;
    var id2NewPwd = hex_md5(String(idNewPwd + "d2f*jk#g&h"));
    document.getElementById('hdnsetpassowrd').value = id2NewPwd;}

function NewResetHashPass() {
    var idNewPwd = document.getElementById('ContentPlaceHolder1_txtconfirmNewPassword').value;
    var id2NewPwd = hex_md5(String(idNewPwd + "d2f*jk#g&h"));
    document.getElementById('ContentPlaceHolder1_hdnresetnewpassword').value = id2NewPwd;}