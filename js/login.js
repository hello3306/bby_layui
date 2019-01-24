$(function () {

    $('#inset').bind('keypress', function (e) {
        let theEvent = e || window.event;
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            login();
        }

    });

    $('#login').on('click', function () {
        login();
    });


    function login() {
        let name = $('#username').val(),
            password = $('#password').val();
        if (!name) {
            dialog.error('账号不能为空');
            throw new Error('账号不能为空');
        }
        if (!password) {
            dialog.error('密码不能为空');
            throw new Error('密码不能为空');
        }

        let param = {
            url: '/token/agent',
            type: 'post',
            data: {
                name: name,
                password: password
            },
            sCallback: function (res) {
                if (res) {

                    window.base.setLocalStorage('token', res.token);
                    // window.base.setLocalStorage('user', res.user);
                    location.href = "../html/index.html";
                }

            },
            eCallback: function (res) {
                if (res.status == 404) {
                    dialog.error('帐号或密码错误');
                }
                console.log(res.responseText);
            }
        };
        window.base.getData(param);
    }
});

