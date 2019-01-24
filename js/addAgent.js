// import 'common'

//刷新当前
// $(".layui-form").on("click",function(){  //此处添加禁止连续点击刷新一是为了降低服务器压力，另外一个就是为了防止超快点击造成chrome本身的一些js文件的报错(不过貌似这个问题还是存在，不过概率小了很多)
//     if($(this).hasClass("refreshThis")){
//         $(this).removeClass("refreshThis");
//         $(".clildFrame .layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload(true);
//         setTimeout(function(){
//             $(".refresh").addClass("refreshThis");
//         },2000)
//     }else{
//         layer.msg("您点击的速度超过了服务器的响应速度，还是等两秒再刷新吧！");
//     }
// })



window.base.stopF5();
window.base.verifyToken();
layui.use(['form'], function () {
    let form = layui.form;
    let id = window.base.getUrlParam('id');

    if (id > 0) {
        var param = {
            url: '/user/agent/get/one',
            type: 'get',
            data: {
                'id': id,
            },
            tokenFlag: true,
            sCallback: function (res) {
                let data = res.data;
                console.log(res);
                if (res.code == 200) {
                    form.val('example', {
                        agentname:data.name,
                        username:data.user,
                        phone:data.telephone,
                        email:data.email,
                        province:data.province1,
                        city1:data.city1,
                        district1:data.district1,
                        address:data.address,
                        beizhu:data.beizhu
                    });
                }

            },
            eCallback: function (res) {
                dialog.error('失败')
            }

        };
        window.base.getData(param);
    }


    //监听提交
    form.on('submit(demo1)', function (data) {
        let info = data.field;
        let name = info.agentname, phone = info.phone, email = info.email, user = info.username, city = info.province1,
            province = info.city1, address = info.address,district=info.district1,beizhu=info.beizhu;
        let param = {
            url: '/user/create',
            type: 'post',
            data: {
                id:id,
                name: name,
                telephone: phone,
                email: email,
                user: user,
                city: city,
                province: province,
                address: address,
                district:district,
                beizhu:beizhu
            },
            tokenFlag: true,
            sCallback: function (res) {
                if (res.code == 200) {
                    dialog.success(res.msg)
                }
            },
            eCallback: function (res) {
                console.log(res)
                console.log(res.responseText.msg);
                if(res.status==400){
                dialog.error('创建失败')
                }
            }
        };
        window.base.getData(param);

    });
});