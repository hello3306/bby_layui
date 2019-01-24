
window.base.stopF5();
window.base.verifyToken();
layui.use(['table', 'element'], function () {
    let table = layui.table;
    let element = layui.element();
    let token=window.base.getLocalStorage('token');
    let baseUrl=window.base.g_restUrl;


    //方法级渲染
    var tableIns = table.render({
        elem: '#LAY_table_user'
        , url: baseUrl+'/hospital/get'
        ,height: 'full-100'
        ,cellMinWidth: 110
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit
        }
        , headers: {token: token}
        , parseData: function (res) { //res 即为原始返回的数据
            if(res.code==200){
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.total, //解析数据长度
                    "data": res.data.data //解析数据列表
                };
            }else{
                layer.msg('错误！请重新登录');
            }

        }
        ,response: {
            statusName: 'code' //规定数据状态的字段名称，默认：code
            , statusCode: '200'  //规定成功的状态码，默认：0
            , msgName: 'msg' //规定状态信息的字段名称，默认：msg
            , countName: 'count' //规定数据总数的字段名称，默认：count
            , dataName: 'data' //规定数据列表的字段名称，默认：data
        }
        , cols: [[
            {checkbox: true, fixed: true}
            , {field: 'id', title: 'ID', width: 63, sort: true, fixed: true}
            , {
                field: 'name',
                title: '医院名称',
                width: 264,
                templet: '#usernameTpl',
                // event: 'setSign',
                style: 'cursor: pointer;'
            }
            , {field: 'id', title: '医院代码', width: 93, sort: true}
            , {field: 'city', title: '所属代理商', width: 284}
            , {field: 'address', title: '所属省事', width: 305}
            , {field: 'Contacts', title: '联系人', width: 126}
            , {field: 'Telephone', title: '联系电话', width: 173}
            , {field: 'classify', title: '二维码', width: 94}
            , {field: 'pay', title: '服务收费', width: 114}
            , {field: 'classify', title: '操作', toolbar: '#barDemo', width: 123}
        ]]
        , id: 'testReload'
        , page: true

    });



    table.on('tool(user)', function (obj) {
        let data = obj.data;

        let hospitalID=data.id;
        layer.open({
            type: 2,
            area: ['1200px', '600px'],
            content: 'hospital_editors.html'+'?code='+hospitalID,
            maxmin: true
        });

    });

    //表格重载
    $('.demoTable .layui-btn').on('click', function() {
        tableIns.reload({
            where: {
                name: $("#demoReload").val()
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

});
