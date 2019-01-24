
$("body").bind("keydown",function(event){
    if(event.keyCode == 116) {
        event.preventDefault();//阻止默认刷新
        $("#main_frame").attr("src",window.frames["main_frame"].src);
    }
});

window.base.verifyToken();
layui.use('element', function () {
    let element = layui.element();
    let $ = layui.jquery;

    //一些事件监听
    element.on('nav(demo)', function (eleme) {
        tabAdd(eleme);
    });

        $('#SignOut').on('click',function () {
            window.base.deleteLocalStorage('token');
            window.base.deleteLocalStorage('user');
            location.href = '../html/login.html';
        });

//添加tab
function tabAdd(eleme) {
    let $ = layui.jquery;
    let navA = $(eleme).find('a');
    let id = navA.attr('data-id');
    let url = navA.attr('data-url');
    let text = navA.attr('data-text');
    if (!url) {
        return;
    }
    let isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
    if (isActive.length > 0) {
        element.tabChange('tab', id);
    } else {
        element.tabAdd('tab', {
            title: text,
            content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
            id: id
        });
        element.tabChange('tab', id);
    }
}
});

var vue= new Vue({
    el:"#lefItem",
    data:{
        hidden:true
    }
});


