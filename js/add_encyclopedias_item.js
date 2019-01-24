window.base.stopF5();
window.base.verifyToken();
layui.use(['form', 'layedit', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;
    let id=window.base.getUrlParam('id');



    if(id>0){
        var param = {
            url: '/knowledge/getOneEncyclopediasItem',
            type: 'get',
            data: {
                'id':id,
            },
            tokenFlag: true,
            sCallback: function (res) {
                let data=res.data;
                if (res.code==200){
                    form.val('example', {
                        'title': data.name
                    });

                }
            },
            eCallback: function (res) {
                dialog.error('失败')
            }

        };
        window.base.getData(param);

    }
    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length < 5) {
                return '标题至少得5个字符啊';
            }
        }
        , pass: [/(.+){6,12}$/, '密码必须6到12位']
        , content: function (value) {
            layedit.sync(editIndex);
        }
    });

    //监听提交
    form.on('submit(demo1)', function (data) {
        let info = data.field;
        let param = {
                url: '/knowledge/addEncyclopediasItem',
                type: 'post',
                data: {
                    ids:id,
                    id: window.base.getUrlParam('code'),
                    name: info.title,
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
                    dialog.error('创建失败');
                }
            }
        ;
        window.base.getData(param);
        return false;
    });


});