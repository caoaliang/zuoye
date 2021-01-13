var baseUrl = ' http://www.itcbc.com:8080';
//-------------------统一配置 headers complete url-------------------
$.ajaxPrefilter(function (option) {

    option.url = baseUrl + option.url;

    option.headers = {
        Authorization: localStorage.getItem('token')
    };

    option.complete = function (xhr) {
        var res = xhr.responseJSON;
        if (res && res.status === 1 && res.message === '身份认证失败！') {
           //说明token过期  删除过期的 token
            localStorage.removeItem('token');
            //跳转到登录页,重新登录
            location.href = './login.html';
        }
    }
}) 

//-------------------获取分类-------------------
// 封装函数获取所有的分类, 并渲染到页面中
// 等后续的 删除 编辑 添加 操作 之后  还要调用这个函数更新页面的数据
// - render -- 渲染
// - category -- 类别
function renderCategory() {
    // 发送ajax请求，获取数据，注意请求头(Authorization）
    $.ajax({
        url: '/my/category/list',
        success: function (res) {
            //  console.log(res);
            if (res.status === 0) {
                //使用模板引擎渲染
                var str = template('tpl-list', res);
                $('tbody').html(str);
            }
        },
        //必须加请求头 ,否则会报 身份认证失败
      
        //请求完成后出发(无论成功或者失败 都会出发)
      
    })
}

renderCategory();




//-------------------删除分类-------------------
$("tbody").on("click", ".del",function () {
    var id = $(this).data('id');
    //使用layui的弹层提示一下
    layer.confirm('你确定不要我了吗?', function(index){
        //do something
        //用户点击了确定,会执行这个函数
         $.ajax({
        url: '/my/category/delete',
        data: { id: id },
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
            }
        },
   })
        //关闭弹层
        layer.close(index);
      });   
   
})


//-------------------添加分类-------------------
//1.点击添加类别,出现弹层
var addIndex;
$('button:contains("添加类别")').on('click', function () {
        addIndex = layer.open({
        type : 1,
        title : '添加类别',
        content: $('#tpl-add').html(),
        area: ['500px', '250px']
      });
})


//2.表单提交,完成添加
$('body').on('submit', '#add-form', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/my/category/add',
        data: $(this).serialize(),
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(addIndex)
            }
        }
    })
})


//-------------------修改分类-------------------
var editIndex;
// 1.点击编辑,出现弹层
$('tbody').on('click', 'button:contains("编辑")', function () {
    var shuju = $(this).data();
    editIndex = layer.open({
        type : 1,
        title : '编辑类别',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px'],
        success: function () {
            // 完成数据回填 （或者叫做为表单赋值）
            $('#edit-form input[name=name]').val(shuju.name);
            $('#edit-form input[name=alias]').val(shuju.alias);
            $('#edit-form input[name=id]').val(shuju.id);
        }
      });
})

//2.完成数据回填(表单赋值)


//3.表单提交,完成修改

$('body').on('submit', '#edit-form', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/category/update',
        data: data,
        success: function (res) {
            // 提示
            layer.msg(res.message);
            // 成功后，更新页面数据，关闭弹层
            if (res.status === 0) {
                renderCategory();
                layer.close(editIndex);
            }
        }
    });
})

