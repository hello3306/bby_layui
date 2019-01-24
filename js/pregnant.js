window.base.stopF5();
window.base.verifyToken();
layui.use('table', function () {

    var table = layui.table
        , form = layui.form;
    let token = window.base.getLocalStorage('token');
    let hospitalID = window.base.getUrlParam('code');
    let baseUrl = window.base.g_restUrl;
    //数据填充


    var tableIns = table.render({
        elem: '#test'
        , url: baseUrl + '/hospital/userNum'
        , cellMinWidth: 110
        , height: 'full-300'
        , toolbar: '#toolbarDemo'
        , title: '用户数据表'
        , headers: {token: token}
        , method: 'post'
        , where: {hospitalID: hospitalID}
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
            }
            if (res.errorCode != '') {
                layer.msg(res.msg);
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
            {checkbox: true}
            , {field: 'id', title: '用户ID', width: 120, unresize: true, sort: true}
            , {field: 'user_name', title: '用户姓名', width: 220,}
            , {field: 'mobile', title: '联系手机', width: 220}
            , {field: 'predicted_time', title: '预产期', width: 220}
            , {field: 'create_time', title: '建档日期', width: 220}
            , {
                field: 'status', title: '状态', width: 120, toolbar: '#barDemo2', templet: function (d) {
                }
            }
            , {field: 'status', title: '提交', width: 200, toolbar: '#barDemo3'}
            , {title: '操作', toolbar: '#barDemo', width: 200}
            , {field: 'status', title: '是否锁定', width: 110, templet: '#checkboxTpl', unresize: true}
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
                    area: ['1100px', '600px'],
                    fixed: true, //不固定
                    maxmin: true,
                    content: 'adduser.html?code=' + hospitalID,

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
            var param = {
                url: '/user/password/Reset',
                type: 'post',
                data: {
                    'id': data.id,
                },
                tokenFlag: true,
                sCallback: function (res) {
                    console.log(res);
                    if (res.code == 200) {
                        dialog.success(res.msg)
                    }

                },
                eCallback: function (res) {
                    dialog.error('失败')
                }

            };
            window.base.getData(param);
        }
        else if (obj.event === 'edit') {
            layer.open({
                type: 2,
                area: ['1200px', '600px'],
                maxmin: true,
                content: 'adduser.html' + '?id=' + data.id + '&code=' + hospitalID,
            });
        }
        else if(obj.event === 'submit'){
            let param = {
                url: '/user/index',
                type: 'put',
                data: {
                    'id': data.id,
                    'type':'+'
                },
                tokenFlag: true,
                sCallback: function (res) {
                    if (res.code == 200) {
                        dialog.success(res.msg)
                    }

                },
                eCallback: function (res) {
                    dialog.error('失败')
                }

            };
            window.base.getData(param);
        }
        else if(obj.event === 'remove'){
            let param = {
                url: '/user/index',
                type: 'put',
                data: {
                    'id': data.id,
                    'type':'-'
                },
                tokenFlag: true,
                sCallback: function (res) {
                    if (res.code == 200) {
                        dialog.success(res.msg)
                    }

                },
                eCallback: function (res) {
                    dialog.error('失败')
                }

            };
            window.base.getData(param);
        }
        else if(obj.event === 'play'){
            layer.open({
                type: 2,
                area: ['1200px', '600px'],
                maxmin: true,
                content: 'PlayVideo.html' + '?id=' + data.id + '&code=' + hospitalID,
            });
        }
    });

    //监听锁定操作
    form.on('switch(lockDemo)', function (obj) {
        let id = obj.elem.defaultValue;
        let status = obj.elem.checked ? "1" : "0";
        let param = {
                url: '/user/display',
                type: 'post',
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

    //表格重载
    $('.demoTable .layui-btn').on('click', function () {
        var  values = $("#demoReload").val();
        if(isNaN(values)){
            window.base.reload(tableIns, values)
        }else{
            tableIns.reload({
                where: {
                    mobile:values,
                    hospitalID:window.base.getUrlParam('code'),
                    // mobile: $("#demoReload").val()
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        }

    });

    $('#list1').on('click', function () {
        tableIns.reload({
            where: {
                index: 1,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    $('#list2').on('click', function () {
        tableIns.reload({
            where: {
                index: 2,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    $('#list3').on('click', function () {
        tableIns.reload({
            where: {
                index: 3,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    $('#list4').on('click', function () {
        tableIns.reload({
            where: {
                index: 4,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    $('#list5').on('click', function () {
        tableIns.reload({
            where: {
                index: 5,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
    $('#list6').on('click', function () {
        tableIns.reload({
            where: {
                index: 6,
                hospitalID: window.base.getUrlParam('code'),
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });
});

