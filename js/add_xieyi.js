
window.base.stopF5();
window.base.verifyToken();
layui.use(['form', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , upload = layui.upload
        , laydate = layui.laydate;

    let baseUrl = window.base.g_restUrl;
    let id=window.base.getUrlParam('id');



    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor');
    layedit.sync(editIndex);

    if(id>0){
        let param = {
            url: '/Agreement/getOne',
            type: 'get',
            data: {
                'id':id,
            },
            tokenFlag: true,
            sCallback: function (res) {
                let data=res.data;
                console.log(res);
                if (res.code==200){
                    form.val('example', {
                        'title': data.name
                    });
                    layedit.setContent(editIndex, data.content);
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
                url: '/Agreement/add',
                type: 'post',
                data: {
                    id:id,
                    name: info.title,
                    content: layedit.getContent(editIndex),
                },
                tokenFlag: true,
                sCallback:function (res) {
                    if (res.code == 200) {
                        dialog.success(res.msg)
                    }
                },
                eCallback: function (res) {
                    console.log(res);
                    dialog.error('创建失败');
                }
            };
            window.base.getData(param);


        return false;
    });


});