
window.base.stopF5();
window.base.verifyToken();
layui.use('table', function () {
    var table = layui.table
        , form = layui.form;
    let token = window.base.getLocalStorage('token');
    let baseUrl = window.base.g_restUrl;
    //数据填充
    var tableIns = table.render({
        elem: '#test'
        , url: baseUrl + '/user/agent/all'
        , cellMinWidth: 110
        , height: 'full-100'
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
            , {field: 'id', title: '代理商编号', width: 120, unresize: true, sort: true}
            , {field: 'name', title: '代理商名称', width: 220,}
            , {field: 'city', title: '所属省份', width: 160}
            , {field: 'province', title: '所属市级', width: 160}
            , {field: 'address', title: '联系地址', width: 160}
            , {field: 'user', title: '联系人', width: 80}
            , {field: 'telephone', title: '联系手机', width: 150}
            , {
                field: 'email', title: '邮箱', width: 180, templet: function (res) {
                    return '<em>' + res.email + '</em>'
                }
            }
            , {field: 'create_time', title: '创建时间', width: 150}
            , {field: 'status', title: '状态', templet: '#switchTpl', unresize: true}
            , {title: '操作', toolbar: '#barDemo'}
        ]]
        , page: true

    });

    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'getCheckData':
                var data = checkStatus.data;
                // layer.alert(JSON.stringify(data));
                layer.open({
                    type: 2,
                    area: ['1200px', '600px'],
                    // fixed: true, //不固定
                    // maxmin: true,
                    content: 'addAgent.html',

                });
                break;
            case 'getCheckLength':
                var data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');
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
        if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
                let param = {
                        url: '/user/agent/delete',
                        type: 'delete',
                        data: {
                            id: data.id,
                        },
                        tokenFlag: true,
                        sCallback:function (res) {
                                if (res.code == 200) {
                                    dialog.success(res.msg)
                                }
                            }

                        ,
                        eCallback: function (res) {
                            console.log(res);
                            dialog.error('失败');
                        }
                    }
                ;
                window.base.getData(param);
                return false;

            });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 2,
                area: ['1200px', '600px'],
                content: 'addAgent.html'+'?id='+data.id,
                maxmin: true
            });
        }
    });

    //监听锁定操作
    form.on('switch(lockDemo)', function (obj) {
        let id = obj.elem.defaultValue;
        let status = obj.elem.checked ? "1" : "0";
        let param = {
                url: '/user/agent/display',
                type: 'put',
                data: {
                    id: id,
                    status: status,
                },
                tokenFlag: true,
                sCallback:
                    function (res) {
                        if (res.code == 200) {
                            dialog.success(res.msg)
                        }
                    },
                eCallback: function (res) {
                    console.log(res);
                    dialog.error('失败');
                }
            }
        ;
        window.base.getData(param);
        return false;
    });

    //表格重载
    $('.demoTable .layui-btn').on('click', function () {
        tableIns.reload({
            where: {
                name: $("#demoReload").val(),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });


});