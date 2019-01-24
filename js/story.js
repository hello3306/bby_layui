window.base.stopF5();
window.base.verifyToken();

layui.use('table', function () {
    var table = layui.table;
    let token = window.base.getLocalStorage('token');
    let hospitalID = window.base.getUrlParam('code');
    let baseUrl=window.base.g_restUrl;
    table.render({
        elem: '#test'
        , url: baseUrl+'/story/get'
        , toolbar: '#toolbarDemo'
        , title: '用户数据表'
        , headers: {token: token}
        , request: {
            pageName: 'page' //页码的参数名称，默认：page
            , limitName: 'size' //每页数据量的参数名，默认：limit
        }
        , parseData: function (res) { //res 即为原始返回的数据
            if (res.code == 200) {
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.total, //解析数据长度
                    "data": res.data.data //解析数据列表
                };
            } else {
                layer.msg('错误！重新登录')
            }
        }
        , response: {
            statusName: 'code' //规定数据状态的字段名称，默认：code
            , statusCode: '200'  //规定成功的状态码，默认：0
            , msgName: 'msg' //规定状态信息的字段名称，默认：msg
            , countName: 'count' //规定数据总数的字段名称，默认：count
            , dataName: 'data' //规定数据列表的字段名称，默认：data
        }
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
            , {field: 'id', title: '序号', width: 120, fixed: 'left', unresize: true, sort: true}
            , {field: 'title', title: '标题',templet: '#usernameTpl', width: 120}
            , {field: 'content', title: '内容', width: 1100}
            , {field: 'create_time', title: '创建时间', width: 200}
            , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
        ]]
        , page: true
    });

    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'getCheckData':
                layer.open({
                    type: 2,
                    area: ['1200px', '600px'],
                    content: 'add_story.html'+'?code='+hospitalID,
                });

                break;
            case 'getCheckLength':
                var data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');34
                break;
            case 'isAll':
                layer.msg(checkStatus.isAll ? '全选' : '未全选');
                break;
        }
        ;
    });

    //监听行工具事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        //console.log(obj)
        if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
                var param = {
                    url: '/story/delete',
                    type: 'post',
                    data: {
                        'id':data.id,
                    },
                    tokenFlag: true,
                    sCallback: function (res) {
                        console.log(res);
                        if (res.code==200){
                            dialog.success(res.msg)
                        }

                    },
                    eCallback: function (res) {
                        dialog.error('失败')
                    }

                };
                window.base.getData(param);
            });
        } else if (obj.event === 'edit') {
            layer.prompt({
                formType: 2
                , value: data.email
            }, function (value, index) {
                obj.update({
                    email: value
                });
                layer.close(index);
            });
        }
    });
});