function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

layui.use(['form', 'layedit', 'laydate','upload'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , upload = layui.upload
        , laydate = layui.laydate;
    var id=getUrlParam('id');
    let baseUrl = window.base.g_restUrl;
    let img_id=0;

    upload.render({
        elem: '#test1'
        , url: baseUrl + '/file/up'
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



    //创建一个编辑器
    let editIndex = layedit.build('LAY_demo_editor');
    layedit.sync(editIndex);
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

    if(id>0){
        var param = {
            url: '/hospital/getExpert/one',
            type: 'get',
            data: {
                'id':id,
            },
            tokenFlag: true,
            sCallback: function (res) {
                let data=res.data;
                console.log(res);
                layedit.setContent(editIndex, data.introduce);
                img_id=data.img_id;
                if (res.code==200){
                    form.val('example', {
                        'title': data.name
                        , "phone": data.mobile
                        , "keshi": data.Department
                        , 'zhicheng': data.Title
                        , "menzhen": data.outpatient_time
                        , "number": data.sort
                    });

                }
                if(data.img!=null){
                $('#demo1').attr('src', data.img.url);}
            },
            eCallback: function (res) {
                dialog.error('失败')
            }

        };
        window.base.getData(param);

    }
    //监听指定开关
    form.on('switch(switchTest)', function (data) {
        layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
            offset: '6px'
        });
    });

    //监听提交
    form.on('submit(demo1)', function (data) {
        let info = data.field;
        if(img_id>0) {
            let param = {
                url: '/hospital/addOneExpert',
                type: 'post',
                data: {
                    id: id,
                    hospitalID: getUrlParam('code'),
                    name: info.title,
                    mobile: info.phone,
                    Department: info.keshi,
                    Title: info.zhicheng,
                    outpatient_time: info.menzhen,
                    communication: info.open,
                    sort: info.number,
                    introduce: info.content,
                    img_id: img_id
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
                    dialog.error('创建失败');
                }
            };
            window.base.getData(param);
        }else{
            layer.msg('等待上传完成');
        }

        return false;
    });



});