window.base.stopF5();
window.base.verifyToken();
layui.use(['form', 'layedit', 'laydate', 'upload'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , upload = layui.upload
        , laydate = layui.laydate;

    var img_id = 0
        , video_id = 0;

    let baseUrl = window.base.g_restUrl;


    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor');

    layedit.sync(editIndex);

    //文件上传

    //普通图片上传
    upload.render({
        elem: '#test1'
        , url: baseUrl + '/file/up'
        ,headers:{}
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            layer.msg('上传成功');
            img_id = res.data;
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
    //视频上传
    upload.render({
        elem: '#test2'
        , url: baseUrl + '/file/up'
        , accept: 'video' //视频
        , done: function (res) {
            layer.msg('上传成功');
            video_id = res.data;

        }
    });

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
        if (img_id == 0 || video_id == 0) {

            layer.msg('等待上传完成');
        } else {
            let info = data.field;
            let param = {
                    url: '/classroom/add',
                    type: 'post',
                    data: {
                        title: info.title,
                        img_id: img_id,
                        video_id: video_id,
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

        }
        return false;
    });


});