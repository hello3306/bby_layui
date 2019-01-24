function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

layui.use(['form', 'layedit', 'laydate'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;


    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor');
    let editIndex2 = layedit.build('LAY_demo_editor2');
    layedit.sync(editIndex);
    layedit.sync(editIndex2);
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
                url: '/hospital/addOneExamination',
                type: 'post',
                data: {
                    hospitalID: getUrlParam('code'),
                    title: info.title,
                    time_title:info.timetitle,
                    time: info.time,
                    content: layedit.getText(editIndex),
                    html: layedit.getText(editIndex2)
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