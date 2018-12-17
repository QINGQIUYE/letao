$(function () {
    function queryProduct(){
        $.ajax({
            // type: "method",
            url: "/product/queryProduct",
            data: {
                page: 1,
                pageSize: 4,
                proName: search
            },
            // dataType: "dataType",
            success: function (data) {
                console.log(data);
                var html = template('productListTpl', data);
                $('.conten ').html(html);
            }
        });
    }
    var search = decodeURI(location.search.split('=')[1]);
    console.log(search);
    queryProduct();

    // 给搜索添加点击事件
    $('.btn-search').on('tap',function(){
//获取当前输入框的值
    search=$('.input-search').val();
    console.log(search);
    queryProduct();
    });

    // 商品排序
    // 1. 如何排序 调用API传入参数进行排序 如果价格传入price 数量传入num
    // 2. 排序顺序 price=1升序 从小到大  price=2降序  从大到小
    // 3. 点击了排序按钮后 如果现在是升序(1) 点击了后变成降序(2)
    // 4. 在a标签默认存储一个排序顺序 默认1升序
    // 5. 点击后切换这个排序顺序的属性的值
    // 6. 还需要知道当前点击a排序方式是price还是num  获取a身上的排序方式
    // 7. 调用APi传入 传入对应排序方式和排序顺序即可 后面渲染页面
    $('.title ul li a').on('tap',function(){
        $(this).parent().addClass('active').siblings().removeClass('active')
        var sort=$(this).data('sort');
        sort=sort==1?2:1;
        if (sort==2) {
        $(this).find('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-up') 
        }else{
        $(this).find('i').removeClass('fa fa-angle-up').addClass('fa fa-angle-down')
        }
        $(this).data('sort',sort);
        var sortType=$(this).data('sort-type');
        console.log(sortType);
        var params={page:1,pageSize:4,proName:search};
        params[sortType]=sort;
        console.log(params);
        
        $.ajax({
            url: "/product/queryProduct",
            data: params,
            success: function (data) {
              var html=template('productListTpl',data);
              $('.conten').html(html);  
            }
        });
    });
// 立即购买
$('.conten').on('tap','.btn-buy',function(){
    console.log(1);
    
    var id=$(this).data('id');
    location='detail.html?id='+id;

});

    // 区域划动
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 下拉刷新和上拉加载
    var page = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                // height:50,
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(function () {
                        // $.ajax({
                        //     // type: "method",
                        //     url: "/product/queryProduct",
                        //     data: {
                        //         page: 1,
                        //         pageSize: 4,
                        //         proName: search
                        //     },
                        //     // dataType: "dataType",
                        //     success: function (data) {
                        //         console.log(data);
                        //         var html = template('productListTpl', data);
                        //         $('.conten ').html(html);
                        //     }
                        // });
                        queryProduct();
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        mui('#refreshContainer').pullRefresh().refresh(true);    
                        page=1;
                    }, 1000);
                    
                }
                
            },
            up: {
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    setTimeout(function () {
                        page++;
                        console.log(page);
                        
                        $.ajax({
                            url: "/product/queryProduct",
                            data: {
                                page: page,
                                pageSize: 4,
                                proName: search
                            },
                            success: function (data) {
                                if (data.data.length > 0) {
                                    // 7.1 调用模板生成html
                                    var html = template('productListTpl', data);
                                    // 7.2 追加到商品列表内容的ul
                                    $('.conten').append(html);
                                    // 7.3 加载完成后结束上拉加载的效果 MUI 结束上拉的函数endPullupToRefresh
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                } else {
                                    // 8. 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                     mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        });
                    }, 1000)
                }
            }
        }
    });
});
