function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString();
}

//获取日期格式2018-11-19
function getToLocaleDateString(time){
    return new Date((time)*1000).toLocaleDateString()
}

layui.use(['form', 'layedit', 'laydate', 'element'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;
    let hospitalID = getUrlParam('code');
    let id = getUrlParam('id');

    if (id > 0) {
        var param = {
            url: '/userBaby/get',
            type: 'get',
            data: {
                'id': id,
            },
            tokenFlag: true,
            sCallback: function (res) {
                let data = res.data,
                    user = data.user,
                    baby1 = data.baby[0],
                    baby2 = data.baby[1];
                if (res.code == 200) {
                    let predicted_time=getToLocaleDateString(user.predicted_time);
                   let birth_time= getLocalTime(baby1.birth_time);
                   console.log(birth_time);
                    form.val('example', {
                        'username': user.user_name
                        , 'mobile': user.mobile
                        , 'predicted_time': predicted_time
                        , 'remarks': user.remarks
                        , 'family_name': user.family_name
                        , 'family_mobile': user.family_mobile
                        , 'family_address': user.family_address
                        , 'family_msg': user.family_msg
                        , 'flow_number_1': baby1.flow_number_1
                        , 'flow_number_1A': baby1.flow_number_2
                        , 'baby_name': baby1.name
                        , 'nickname': baby1.nickname
                        , 'birth_time': birth_time
                        , 'sex': baby1.sex
                        , 'blood': baby1.blood
                        , 'height': baby1.height
                        , 'weight': baby1.weight
                    });

                    if(baby2){
                        let birth_time2= getLocalTime(baby2.birth_time);
                        form.val('example', {
                             'flow_number_2': baby2.flow_number_1
                            , 'flow_number_2A': baby2.flow_number_2
                            , 'baby_name1': baby2.name
                            , 'nickname1': baby2.nickname
                            , 'birth_time1': birth_time2
                            , 'sex1': baby2.sex
                            , 'blood1': baby2.blood
                            , 'height1': baby2.height
                            , 'weight1': baby2.weight
                        });
                    }

                }

            },
            eCallback: function (res) {
                dialog.error('失败')
            }

        };
        window.base.getData(param);
    }

    //日期
    laydate.render({
        elem: '#date'
    });
    laydate.render({
        elem: '#test4'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#test5'
        , type: 'datetime'
    });

    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor');

    //自定义验证规则
    form.verify({
        title: function (value) {
            if (value.length <= 0) {
                return '姓名不能为空';
            }
        }
        , pass: [/(.+){6,12}$/, '密码必须6到12位']
        , content: function (value) {
            layedit.sync(editIndex);
        }
    });

    //监听提交
    form.on('submit(demo1)', function (data) {
        var data = data.field;
        var param = {
            url: '/user/createUser',
            type: 'post',
            data: {
                'id':id,
                'hospitalID': hospitalID,
                'name': data.username,
                'telephone': data.mobile,
                'remarks': data.remarks,
                'predicted_time': data.predicted_time,
                'family_name': data.family_name,
                'family_mobile': data.family_mobile,
                'family_address': data.family_address,
                'family_msg': data.family_msg,

                'baby_name': data.baby_name,
                'nickname': data.nickname,
                'sex': data.sex,
                'height': data.height,
                'weight': data.weight,
                'birth_time': data.birth_time,
                'blood': data.blood,
                'staff': data.staff,
                'flow_number_1': data.flow_number_1,
                'flow_number_1A': data.flow_number_1A,

                'baby_name1': data.baby_name1,
                'nickname1': data.nickname1,
                'sex1': data.sex1,
                'height1': data.height1,
                'weight1': data.weight1,
                'birth_time1': data.birth_time1,
                'blood1': data.blood1,
                'staff1': data.staff1,
                'flow_number_2': data.flow_number_2,
                'flow_number_2A': data.flow_number_2A,

            },
            tokenFlag: true,
            sCallback: function (res) {
                if (res.code == 200) {
                    dialog.success(res.msg)
                }

            },
            eCallback: function (res) {
                dialog.error('创建失败')
            }

        };
        console.log(param);
        window.base.getData(param);


        return false;
    });


});