$(function(){
    // var slider = mui('.mui-slider');
    // slider.slider({
    //   interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
    // });
    // mui('.mui-scroll-wrapper').scroll({
    //     deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    // });
    var id = getQueryString('id');
    console.log(id);
    
    $.ajax({
        url: "/product/queryProductDetail",
        data:{id:id},
        success: function (data) {
            var min = data.size.split('-')[0] - 0;
            console.log(min);
            
            // 3.2  拿到当前字符串最小值
            var max = data.size.split('-')[1];
            console.log(max);
            // 3.4 把data.size赋值为空数组
            data.size = [];
            // 3.5 循环从最小开始到最大结束
            for (var i = min; i <= max; i++) {
                // 3.6 把循环的每个都添加到数组里面
                data.size.push(i);
            }
            console.log(data);
            // 4. 调用商品详情的模板生成html
            var html = template('productDetailTpl', data);
            $('#productDetail').html(html);
            // 5. 等到页面中的商品详情信息加载完了后再 初始化区域滚动保证不会有问题
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 6. 等轮播图结构出来了之后再初始化轮播图
            mui('.mui-slider').slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 7. 数字框也是动态添加要手动初始化 
            mui('.mui-numbox').numbox();
            // 8. 尺码默认也是不能点击的手动初始化
            $('.btn-size').on('tap', function() {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    })
// 加入购物车
        $('.btn-add-cart').on('tap', function () {
            var size = $('.btn-size.active').data('size');
            console.log($('.btn-size.active'));
            console.log(size);
            if (!size) {
                mui.toast('请选择尺码', {
                    duration: 2000,
                    type: 'div'
                });
                return false;
            }
            var num = mui('.mui-numbox').numbox().getValue();
            console.log(num);
            if (!num) {
                mui.toast('请选择数量', {
                    duration: 2000,
                    type: 'div'
                });
                return false;
            }
            $.ajax({
                url: "/cart/addCart",
                type:'post',//提交数据 都是post
                data: {
                    productId: id,
                    size: size,
                    num: num
                   
                },
                success: function (data) {
                    if (data.success) {
                        mui.confirm('加入购物车成功！ 是否要去购物车查看?', 'hello 单身狗', ['去看',  '不看'], function (e) {
                            // 获取当前用户点击了左边的还是右边
                            console.log(e);
                            if (e.index == 0) {
                                //点击了左边 跳转到购物车查看
                                location='cart.html';
                            } else {
                                // 点击否就不看 表示还继续吗
                                mui.toast('你继续加一件就可以脱离单身了！', {
                                    duration: 3000,
                                    type: 'div'
                                });
                            }
                        });
                    }else{
                        // 9. 加入失败表示未登录  跳转到登录页面 指定当前登录成功要返回的页面 返回当前的详情页面
                        console.log(location);
                        // location = 'login.html?returnUrl='+'http://localhost:3000/m/detail.html?id=1';
                        // location.href 就是当前页面的url
                        location = 'login.html?returnUrl='+location.href;
                    }
                }
            });
        });


       // 根据url参数名取值
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
    
})