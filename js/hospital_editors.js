window.base.stopF5();
window.base.verifyToken();

layui.use(['form', 'layedit', 'laydate','upload'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , upload = layui.upload;
    var img_id = 0;
    let baseUrl = window.base.g_restUrl;


    //普通图片上传
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
    var editIndex = layedit.build('LAY_demo_editor'),
        chanke = layedit.build('chanke');

    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length < 5) {
                return '至少得5个字符啊';
            }
        }
        , pass: [/(.+){6,12}$/, '密码必须6到12位']
        , content: function (value) {
            layedit.sync(editIndex);
        }
    });



    //监听提交
    form.on('submit(demo1)', function (res) {
        var data = res.field;
        console.log(data);
        if(img_id!=0) {
            var param = {
                url: '/hospitalInfo/update',
                type: 'post',
                data: {
                    'id':data.code,
                    'name': data.hospital_name,
                    'Contacts': data.username,
                    'email': data.email,
                    'Telephone': data.phone,
                    'Hospital_introduction': layedit.getContent(editIndex),
                    'Obstetric_introduction': layedit.getContent(chanke),
                    'img_id': img_id,
                    'province': data.province1,
                    'city': data.city1,
                    'district': data.district1
                },
                tokenFlag: true,
                sCallback: function (res) {
                    if (res.code==200){
                        dialog.success(res.msg)
                    }
                },
                eCallback: function (res) {
                    dialog.error('失败')
                }

            };
            window.base.getData(param);

        }else{
            layer.msg('等待上传完成');
        }
        return false;
    });

    let param = {
        url: '/hospital/getOne',
        type: 'get',
        data: {
            hospitalID: window.base.getUrlParam('code'),
        },
        tokenFlag: true,
        sCallback: function (res) {
            if (res.code == 200) {
                //表单初始赋值
                let data = res.data;
                let Hospital_introduction = data.Hospital_introduction,
                    Obstetric_introduction = data.Obstetric_introduction;
                    img_id=data.img_id;
                layedit.setContent(editIndex, Hospital_introduction);
                layedit.setContent(chanke, Obstetric_introduction);
                form.val('example', {
                    "modules": ''
                    , 'hospital_name': data.name
                    , "code": data.id
                    , "username": data.Contacts
                    , "phone": data.Telephone
                    , "email": data.email
                    , 'province1': data.province
                    , "city1": data.city
                    , "district1": data.district
                    , "money": true //开关状态
                });
                if(data.img!=null){
                    $('#demo1').attr('src', data.img.url);}


            }
        },
        eCallback: function (res) {
            dialog.error('失败')
        }
    };
    window.base.getData(param);


});
