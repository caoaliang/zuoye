// 登录功能
// 找到表单,注册submit事件 -->阻止默认行为 -->收集表单数据(查询字符串形式) -->Ajax提交
$(".login form").on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serializeArray();//得到一个数组,JQ会把数组转成查询字符串
    $.ajax({
        type: 'POST',
        url: ' http://www.itcbc.com:8080/api/login',
        data: data,
        success: function (res) {
            //无论成功失败都给出提示
            layer.msg(res.message);
            if (res.status === 0) {
                localStorage.setItem('token',res.token)
                //跳转 路径和时候用js的html页面有关系
                location.href = './category.html'
            }
        },
        error: function (xhr) {
            var res = xhr.responseJSON;  //表示响应的结果
            if (res && res.status === 1) {
                layer.msg(res.message);
             }
        }
    })
})