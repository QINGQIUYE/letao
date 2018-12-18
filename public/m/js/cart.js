$(function(){
    queryCart();
    var  page=1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            // 初始化下拉
            down: {
                callback: function() {
                    // 模拟请求网络请求延迟
                    setTimeout(function() {
                        // 3. 在下拉刷新的函数请求最新的数据
                        queryCart();
                        // 4. 结束下拉刷新的效果(不结束会一直转) 在官方文档函数后 多加一个 ToRefresh
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 11. 下拉结束后重置上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        // 12. 把page也要重置为1
                        page = 1;
                    }, 1000);
                }
            },
            // 初始化上拉
            up: {
                callback: function() {
                    // 只是为了模拟延迟
                    setTimeout(function() {
                        // 6. 上拉加载的回调函数让page++
                        page++;
                        // 7. 请求page++了之后的更多的数据
                        $.ajax({
                            url: '/cart/queryCartPaging',
                            data: { page: page, pageSize: 4 },
                            success: function(data) {
                                console.log(data);
                                // 判断当前返回数据是否报错 报错表示未登录 跳转到登录页面
                                if (data.error) {
                                    // 跳转到登录页面 同时登录成功回到当前购物车页面
                                    location = 'login.html?returnUrl=' + location.href;
                                } else {
                                    // []  一开始这个样子的数组
                                    // {
                                    // 	data:[]
                                    // }// 变成这个样子的对象
                                    console.log(data instanceof Array);
                                    // 判断后返回的数据是不是一个数组 是一个数组 转成一个对象 给对象添加一个data数组 值就是当前的data
                                    if (data instanceof Array) {
                                        data = {
                                            data: data
                                        }
                                    }
                                    if (data.data.length > 0) {
                                        // 调用模板方法生成html
                                        var html = template('cartListTpl', data);
                                        // 8. 追加append到购物车的列表
                                        $('.cart-list').append(html);
                                        // 9. 结束上拉加载效果
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                    } else {
                                        // 10. 结束上拉加载效果提示没有数据了
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }

                                }
                            }
                        });
                    }, 1000);
                }
            }
        }
    });
    function queryCart(){
        $.ajax({
            url: "/cart/queryCartPaging",
            data: {page:1,pageSize:4},
            success: function (data) {
                if (data.error) {
                    location='login.html?returnUrl=' + location.href;
                }else{
                    console.log(data instanceof Array);
                    if (data instanceof Array) {
                        data={
                            data:data
                        }
                    }
                    console.log(data);
                   var html=template('cartListTpl',data) ;
                   $('.cart-list').html(html);
                    
                }
            }
        });
    }
    $('.cart-list').on('tap','.btn-delete',function(){
        var that=this;
        mui.confirm( '您真的要忍心不要我吗?', '亲',  ["确认", "取消"] ,function(e){
            console.log(e.index);
            if (e.index==0) {
                var id=$(that).data('id')
                console.log(id);
                $.ajax({
                    url: "/cart/deleteCart",
                    data: {id:id},
                    success: function (data) {
                        if (data.success) {
                            queryCart()
                        }
                    }
                });
            } else if (e.index==1) {
                console.log(this);
                // mui官方恢复官方
                 mui.swipeoutClose($(that).parent().parent()[0]);
                
            }
        })
   
       
        
    })
    $('.cart-list').on('tap','.btn-edit',function(){
        var that=this;
        console.log(this);
        var product=$(this).data('product');
       var min=product.productSize.split('-')[0] - 0;
       var max=product.productSize.split('-')[1] ;
       product.productSize=[]
    //    遍历所有尺码
          for (var i = min; i <= max; i++) {
            product.productSize.push(i);
        }
        console.log(product);
        // 调用模板方法生成html
        var html=template('editCartTpl',product);
        console.log(html);
        html = html.replace(/[\r\n]/g, "");
        mui.confirm( html, '编辑商品',['确定', '取消'],function(e){
            if (e.index==0) {
                // 确定则修改数据   
                $.ajax({
                    type: 'post',
                    url: "/cart/updateCart",
                    data: {id:product.id,size:$('btn-size active').data('size') ,
                    num:mui('.mui-numbox').numbox().getValue()},
                    success: function (data) {
                        if (data.success) {
                            queryCart()
                        }
                    }
                });
            } else {
                mui.swipeoutClose($(that).parent().parent()[0]);
            }
        })
        mui('.mui-numbox').numbox().setValue(product.num);
        // 7.3 尺码默认也是不能点击的手动初始化
        $('.btn-size').on('tap', function() {
            $(this).addClass('active').siblings().removeClass('active');
        });
    })
 
})