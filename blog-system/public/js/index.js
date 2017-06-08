/**
 * 
 */

$(function() {
    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');

    // 点击‘马上注册’，切换到注册面板
    $loginBox.find('a.colMint').on('click',function () {
        $registerBox.show();
        $loginBox.hide();
    });

    // 点击‘马上登录，切换到登录面板
    $registerBox.find('a.colMint').on('click',function () {
        $loginBox.show();
        $registerBox.hide();
    });

    // 点击注册按钮，AJAX发送请求
    $registerBox.find('button').on('click',function(){
        // 通过AJAX提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',//请求地址，后端定义的路由地址
            data: {
                username: $registerBox.find('[name=username]').val(),
                password: $registerBox.find('[name=password]').val(),
                repassword: $registerBox.find('[name=repassword]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);
                if (!result.code) {
                    //注册成功，，0为失败返回的状态码对0 取非，返回true
                    setTimeout(function(){ 
                        $loginBox.show();
                        $registerBox.hide();
                    },1000);//只执行一次，一秒后才执行
                }
            }
        });
    })

    // 点击登录按钮，AJAX发送请求
    $loginBox.find('button').on('click',function(){
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name=username]').val(),
                password: $loginBox.find('[name=password]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);
                $loginBox.find('.colWarning').html(result.message);

                if (!result.code) {
                        window.location.reload();
                }
            }
        });
        
    })

    $('#logout').on('click',() =>{
            $.ajax({
                url: 'api/user/logout',
                success: (result) => {
                    if (!result.code) {
                        window.location.reload();
                    }
                }
            })
        })
})//END