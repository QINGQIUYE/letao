$(function(){
    $('.login').on('tap',function(){
        // 获取账号和密码
        var username=$('.username').val().trim();
        // .trim();删除字符串前后的空格
        var password=$('.password').val().trim();
        if (!username) {
            mui.toast('账号不能为空',{ duration:2000, type:'div' }) 
            return false
        }
        if (! password) {
            mui.toast('密码不能为空',{ duration:2000, type:'div' }) 
            return false
        }
        $.ajax({
            type: "post",
            url: "/user/login",
            data: {username:username,password:password},
            success: function (data) {
                if (data.success) {
                    var returnUrl = getQueryString('returnUrl');
                    location=returnUrl;
                }else {
                    // 7. 失败 提示用户失败的原因 把错误信息data.message作为提示内容
                    mui.toast(data.message, { duration: 'long', type: 'div' })
                }
            }
        });
    })
    $('.register').on('tap',function(){
        location='register.html';
    });
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
});