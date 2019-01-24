function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

layui.use(['form', 'layedit', 'upload'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , $ = layui.jquery
        , upload = layui.upload;


    //普通图片上传
    // var uploadInst = upload.render({
    //     elem: '#test1'
    //     , url: '/upload/'
    //     , before: function (obj) {
    //         //预读本地文件示例，不支持ie8
    //         obj.preview(function (index, file, result) {
    //             $('#demo1').attr('src', result); //图片链接（base64）
    //         });
    //     }
    //     , done: function (res) {
    //         //如果上传失败
    //         if (res.code > 0) {
    //             return layer.msg('上传失败');
    //         }
    //         //上传成功
    //     }
    //     , error: function () {
    //         //演示失败状态，并实现重传
    //         var demoText = $('#demoText');
    //         demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
    //         demoText.find('.demo-reload').on('click', function () {
    //             uploadInst.upload();
    //         });
    //     }
    // });

    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor');
    layedit.sync(editIndex);

    //监听提交
    form.on('submit(newsSubmit)', function (data) {
        let info = data.field;
        // console.log(layedit.getContent(editIndex));
        let param = {
            url: '/news/add',
            type: 'post',
            data: {
                hospitalID: getUrlParam('code'),
                title: info.title,
                content: layedit.getContent(editIndex),
                type: info.news
            },
            tokenFlag: true,
            sCallback: function (res) {
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
