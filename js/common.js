window.base = {
    // g_restUrl: 'http://127.0.0.1/api/v1',
    g_restUrl: 'https://api.ljxcx.club/api/v1',
    getData: function (params) {
        if (!params.type) {
            params.type = 'get';
        }
        var that = this;

        $.ajax({
            type: params.type,
            url: this.g_restUrl + params.url,
            data: params.data,
            beforeSend: function (XMLHttpRequest) {
                if (params.tokenFlag) {
                    XMLHttpRequest.setRequestHeader('token', that.getLocalStorage('token'));
                }
            },
            success: function (res) {
                params.sCallback && params.sCallback(res);
            },
            error: function (res) {
                params.eCallback && params.eCallback(res);
            }
        });
    },

    setLocalStorage: function (key, val) {
        var exp = new Date().getTime() + 2 * 24 * 60 * 60 * 100;  //令牌过期时间
        var obj = {
            val: val,
            exp: exp
        };
        localStorage.setItem(key, JSON.stringify(obj));
    },

    getLocalStorage: function (key) {
        var info = localStorage.getItem(key);
        if (info) {
            info = JSON.parse(info);
            if (info.exp > new Date().getTime()) {
                return info.val;
            }
            else {
                this.deleteLocalStorage('token');
            }
        }
        return false;
    },

    deleteLocalStorage: function (key) {
        return localStorage.removeItem(key);
    },

    verifyToken: function () {
        let param = {
            url: '/token/verifyToken',
            type: 'post',
            tokenFlag: true,
            sCallback: function (res) {

            },
            eCallback: function (res) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '登录已过期'
                        , content: '登录已过期，请重新登录！'
                        , yes(res) {
                            location.href = "/www/layui2/html/login.html";
                        }
                    });

                });
            }
        };
        this.getData(param)
    },

    //本界面刷新
    stopF5: function () {
        $("body").bind("keydown", function (event) {
            if (event.keyCode == 116) {
                event.preventDefault(); //阻止默认刷新
                location = location;
            }
        });
    },
    //表格重载
    reload(tableIns,name) {
        tableIns.reload({
            where: {
                name:name,
                hospitalID:window.base.getUrlParam('code'),
                // mobile: $("#demoReload").val()
            },
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    },

    getUrlParam: function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

};
