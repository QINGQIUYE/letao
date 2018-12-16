$(function(){
$('.btn-search').on('tap',function(){
    var search=$('.input-search').val();
    if(!search.trim()){
        alert('请输入正确的名称')
        return;
    }
    var historyData=JSON.parse(localStorage.getItem('searchHistory'))||[];

    if(historyData.indexOf(search)!=-1){
        historyData.splice(historyData.indexOf(search),1);
    }
    historyData.unshift(search);
    localStorage.setItem('searchHistory',JSON.stringify(historyData));
    queryHistory();
    location = 'productlist.html?search='+search;


});
    queryHistory();
    function queryHistory() {
        var historyData=JSON.parse(localStorage.getItem('searchHistory'))||[];
        // 2. 数据是一个数组 模板引擎要求对象 需要包装一下
        historyData={rows:historyData};
        console.log(historyData);
        // 3. 调用模板方法生成html
        var html = template('searchListTpl', historyData);
        // 4. 把html渲染到ul里面
        $('.search-history .mui-table-view').html(html);
    }
    $('.search-history .mui-table-view').on('tap', '.btn-delete', function() {
        // 2. 获取当前点击x的删除的元素的索引
        var index = $(this).data('index');
        // 3. 获取本地存储的所有数据
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 4. 当前索引元素删除
        historyData.splice(index, 1);
        console.log(historyData);
        // 5. 把删除完成后的数组重新保存到存储里面
        localStorage.setItem('searchHistory', JSON.stringify(historyData));
        // 6. 删除完成搜索记录后调用查询重新渲染搜索历史列表
        queryHistory();
    });
    // 4. 清空搜索记录
    // 1. 给清空按钮添加点击事件
    $('.btn-clear').on('tap', function() {
        // 2. 删除整个searchHistory的键
        localStorage.removeItem('searchHistory');
        // 3. 清空之后重新调用查询刷新页面
        queryHistory();
    });
});