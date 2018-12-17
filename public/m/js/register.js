$(function () {
    var vCode = '';

    // 给注册按钮添加事件
    $('.btn-register').on('tap', function () {
        var check = true;
        mui(".mui-input-group input").each(function () {
            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        });
         //校验通过，继续执行业务逻辑 
        if (check) {
            var mobile = $('.mobile').val()
            if (!(/^1[34578]\d{9}$/.test(mobile))) {
                mui.alert("用户手机不合法!");
                return false;
            }
            var username = $('.username').val()
            if (username.length > 10) {
                mui.alert('用户名太长了,请小于10位内')
                return false
            }
            var password1 = $('.password1').val();
            var password2 = $('.password2').val();
            if (password1 != password2) {
                mui.alert('两次密码不一致')
                return false
            }
            var vcode = $('.vcode').val()
            if (vCode != vcode) {
                mui.alert('验证码有误')
                return false
            }
            $.ajax({
                type: "post",
                url: "/user/register",
                data: {
                    mobile: mobile,
                    username: username,
                    password: password1,
                    vCode: vCode
                },
                success: function (data) {
                    if (data.success) {
                        mui.toast('注册成功')
                        location = 'login.html?returnUrl=user.html';
                    } else {
                        mui.toast(data.message);
                    }
                }
            })
        }
    });
    $('.btn-get-vcode').on('tap', function () {
        $.ajax({
            url: '/user/vCode',
            success: function (data) {
                console.log(data.vCode);
                //把API返回的验证码赋值给全局变量
                vCode = data.vCode;
            }
        })
    })
})