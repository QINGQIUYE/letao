$(function(){
var search=decodeURI(location.search.split('=')[1]);
console.log(search);
$.ajax({
    // type: "method",
    url: "/product/queryProduct",
    data: {page:1,pageSize:4,proName:search},
    // dataType: "dataType",
    success: function (data) {
        console.log(data);
        
        var html=template('productListTpl',data);
        $('.conten ').html(html);
    }
});

});