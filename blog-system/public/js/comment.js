/**
 * 
 */
var perpage = 5;
var page = 1;
var pages = 0;
var comments;

$('#messageBtn').on('click', function () {
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            // console.log(responseData)
            $('#messageContent').val('');
            comments = responseData.data.reverse();
            renderComment()
        }
    })
})
// 每次页面重载，获取所有评论

$.ajax({
    type: 'get',
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val(),
    },
    success: function (responseData) {
        comments = responseData.data.reverse();
        renderComment()
    }
})

$('.pager').delegate('a', 'click', function () {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment()
})


function renderComment() {



    $('#messageCount').html(comments.length)

    pages = Math.max(Math.ceil(comments.length / perpage), 1);
    var start = Math.max(0, (page - 1) * perpage);
    var end = Math.min(start + perpage, comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html(page + '/' + pages)

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页</span>')
    } else {
        $lis.eq(0).html('<a>上一页</a>')
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页</span>')
    } else {
        $lis.eq(2).html('<a>下一页</a>')
    }

    if (comments.length == 0) {
        $('.messageList').html('<div>还没有评论</div>');
    } else {
        var html = '';
        for (var i = start; i < end; i++) {
            html += '<div class="messageBox"><p class="name"><span>';
            html += comments[i].username + +formatDate(comments[i].postTime) + '</span><span>';
            html += comments[i].content + '</span></p></div>'
        }
        $('.messageList').html(html);
    }



}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + date1.getMonth() + date1.getDate();
}