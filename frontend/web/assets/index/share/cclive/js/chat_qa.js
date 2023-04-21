/**
 * Created by apple on 16/7/8.
 */

$(function(){

    var maxMessageCount = 100, maxMessageLength = 300;

    // 开始直播
    DWLive.onLiveStart = function(j){
        // console.log(j);
    };

    // 停止直播
    DWLive.onLiveEnd = function(j){
        // console.log(j);
    };

    // 在线人数
    DWLive.onUserCountMessage = function(j){
        // console.log(j);
    };

    // 接收公聊
    DWLive.onPublicChatMessage = function(j){
        var msg = JSON.parse(j);
        var adminClass = '';
        var adminText = '';
        if (msg.userrole == 'publisher' || msg.userrole == 'teacher' || msg.userrole == 'host') {
            adminClass = 'admin';
            adminText = '<span>管理</span>';
        }
        var name = escapeHTML(msg['username']), msgStr = showEm(msg['msg']
            || ''), userId = msg['userid'], divEl;
        if (name == DWLive.viewername) {
            divEl = '<li class="message msg-send"><div class="msg-info"><span class="user-name ' + adminClass + '">' + adminText
                + name
                + ':</span><span class="msg-time">' + msg.time + '</span></div><div class="msg-content">'
                + msgStr + '</div></li>';
        } else {
            divEl = '<li class="message message-received"><div class="msg-info"><span class="user-name ' + adminClass + '">' + adminText
                + name
                + ':</span><span class="msg-time">' + msg.time + '</span></div><div class="msg-content">'
                + msgStr + '</div></li>';
        }
        $('#chat_container').append(divEl);
        var messageCount = $('#chat_container').children().length;
        var overCount = messageCount - maxMessageCount;
        if (overCount > 0) {
            $('#chat_container > div:lt(' + overCount + ')')
                .remove();
        }

        $('#chat_container').parent().scrollTop($('#chat_container').height());

    };

    // 接收私聊
    DWLive.onPrivateChatMessage = function(s){
        var j = JSON.parse(s);
        $('#chat_container')
            .append(
                '<li class="message msg-send pchat"><div class="msg-info"><span class="user-name">我对讲师说:</span><span class="msg-time">' + j.time + '</span></div><div class="msg-content">'
                + showEm(j.msg) + '</div></li>');
        $('#chat_container').parent().scrollTop($('#chat_container').height());
    };

    // 接收私聊回复
    DWLive.onPrivateAnswer = function(s){
        var j = JSON.parse(s);
        $('#chat_container')
            .append(
                '<li class="message message-received pchat"><div class="msg-info"><span class="user-name">讲师('
                + j.fromusername
                + ')对我说:</span><span class="msg-time">' + j.time + '</span></div><div class="msg-content">'
                + showEm(j.msg) + '</div></li>');
        $('#chat_container').parent().scrollTop($('#chat_container').height());

    };


    // 提问
    DWLive.onQuestion = function(s){
        var j = JSON.parse(s);
        if (!j) {
            return;
        }
        if (j.action !== 'question') {
            return;
        }
        var v = j.value;
        if (!v) {
            return;
        }
        var qid = v.id,
            qc = v.content,
            quid = v.userId,
            quname = v.userName;
        if (!$('#questionInfo').length) {
            return;
        }

        var q = $('#questionInfo #' + qid);
        if (!q.length) {
            $('#questionInfo').append('<li style="display:none;" id="' + qid + '"></li>');
            q = $('#questionInfo #' + qid);
        }

        var self = '';
        if (quname == DWLive.viewername) {
            self = 'self';
        }

        q.append('<p class="qaask"><span class="askname ' + self + '">' + $.escapeHTML(quname) + '：</span><span class="askmsg">' + $.escapeHTML(qc) + '</span></p>');
        if (quname == DWLive.viewername) {
            q.show();
            q.attr('self', "1");
        }
        $('#questionInfo').parent().scrollTop($('#questionInfo').height());
    };

    // 接收回答
    DWLive.onAnswer = function(s){
        var j = JSON.parse(s);
        if (!j) {
            return;
        }
        if (j.action !== 'answer') {
            return;
        }
        var v = j.value;
        if (!v) {
            return;
        }
        var qid = v.questionId,
            qc = v.content,
            quid = v.userId,
            quname = v.userName,
            questionUserId = v.questionUserId,
            isPrivate = v.isPrivate;

        if (questionUserId != $('#viewerId').val() && isPrivate) {
            return;
        }
        if (!$('#questionInfo').length) {
            return;
        }
        var q = $('#questionInfo #' + qid);
        if (!q.length) {
            return;
            // $('#questionInfo').append('<li style="display:none;" id="' + qid + '"></li>');
            // q = $('#questionInfo #' + qid);
        }
        q.append('<p class="qaanswer"><span class="icon08"></span><span class="answername">' + $.escapeHTML(quname) + '：</span><span class="answermsg">' + $.escapeHTML(qc) + '</span></p>');
        q.attr('isAnswer', '1');

        if (!$('.myask').hasClass('askactive')) {
            q.show();
        } else {
            if (!$(".qare").hasClass("on")) {
                $(".qare").addClass("showt");
            }
        }
        $('#questionInfo').parent().scrollTop($('#questionInfo').height());
    };

    // 禁言
    DWLive.onInformation = function(j){
        alert('您已经被禁言！');
    };

    $('#chatlistbtn').click(function () {
        var f = $(this).attr('for');
        if (f === 'all') {
            $('#chatlistbtn').addClass('askactive');
            $(this).attr('for', 'tearch');
            $("#chat_input").attr('placeholder', '私聊模式,您的发言仅管理员可见');
        } else {
            $('#chatlistbtn').removeClass('askactive');
            $(this).attr('for', 'all');
            $("#chat_input").attr('placeholder', '公聊模式,您的发言所有人可见');
        }
    });

    $(".myask").click(function (e) {
        $(this).toggleClass("askactive");
        if ($(this).hasClass('askactive')) {
            $('#questionInfo li').hide();
            $('#questionInfo li[self="1"]').show();
        } else {
            $('#questionInfo li[isAnswer="1"]').show();
        }

        return false;
    });

    // 展示公告
    $('.gboxw .gbtn').click(function () {
        $('.gboxw .gbox').show();
        $('.gboxw .gbtn').hide();
    });

    // 隐藏公告
    $('.gboxw .closegbox').click(function () {
        $('.gboxw .gbox').hide();
        $('.gboxw .gbtn').show();
    });

    // 发布公告
    DWLive.onAnnouncementRelease = function(j){
        $('.gbox div').html(j);
        $('.gbtn').click();
    };

    DWLive.onAnnouncementShow = function(j){
        $('.gbox div').html(j);
    };

    // 删除公告
    DWLive.onAnnouncementRemove = function(){
        $('.gbox div').html('暂无公告');
    };

});

function chatSend(){

    var msg = $.trim($("#chat_input").val());

    if ($('#chatlistbtn').attr('for') === 'all') {

        DWLive.sendPublicChatMsg(msg); // 发送公聊

    } else {

        DWLive.sendPrivateChatMsg(msg); // 发送私聊
    }

    $("#chat_input").val('').focus();
}

function qaSend(){
    var qa = $('#qaV');
    var msg = $.trim(qa.val());

    if(!msg){
        alert('请输入您的问题！');
        return;
    }

    if (msg.length > 300) {
        alert('问题不能超过300个字符');
        return;
    }

    DWLive.sendQuestionMsg(msg); // 发送问题

    qa.val('').focus();
}


function showEm(str) {
    if (!$.trim(str)) {
        return '';
    }
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="http://view.csslcloud.net/img/em/$1.gif" border="0" />');
    str = str.replace(/\[em2_([0-9]*)\]/g, '<img src="http://view.csslcloud.net/img/em2/$1.png" border="0" />');

    var nmsg = '';
    $.each(str.split(' '), function (i, n) {
        n = $.trim(n);
        if (n.indexOf('[uri_') == 0 && n.indexOf(']') == n.length - 1 && n.length > 6) {
            var u = n.substring(5, n.length - 1) + ' ';
            nmsg += '<a target="_blank" style="color: #2f53ff" href="' + u + '">' + u + '</a>' + ' ';
        } else {
            nmsg += n + ' ';
        }
    });

    return nmsg;
}

function escapeHTML(str) {
    if (!str) {
        return "";
    }
    var HTMLREGEXP = /\<|\>|\"|\'|\&|\s/g;
    return str.replace(HTMLREGEXP, function (s) {
        switch (s) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "\"":
                return "&quot;";
            case "'":
                return "&#39;";
            case " ":
                return "&nbsp;";
            default:
                return "";
        }
    });
}
