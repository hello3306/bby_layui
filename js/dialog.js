var dialog = {
//    错误弹出层
    error: function (message) {
        layer.open({
            content:message,
            icon:2,
            title:'错误提示'
        });
    },

    // 成功弹窗
    success:function (message,url='') {
        layer.open({
            content:message,
            icon:1,
            yes:function () {
            location.href=url;
            }
        });
    }
};