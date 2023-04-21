/**
 * Created by shanglt on 15/12/10.
 */
$(function () {
    Template.init();
});



// 接收聊天信息
function on_cc_live_chat_msg(data) {
    // {userid: "94b806f846cf4fdb8707b4f66015be44", username: "ss", msg: "11111", time: "15:31:57"}
    $('#chat-list').append(Template.chatMsg({
        name: data.username,
        content: showEm(data.msg)
    }));

    chatScroll();
}

// 接收发送私聊
function on_cc_live_chat_private_question(data) {
    // {userid: "94b806f846cf4fdb8707b4f66015be44", username: "ss", msg: "123123", time: "15:54:03"}
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: data.username,
        toUserName: '管理员',
        content: showEm(data.msg),
    }));

    chatScroll();
}

// 接收回答私聊
function on_cc_live_chat_private_answer(data) {
    // {"fromuserid":"d0d359766d694d0aa0e778094ff7d892","fromusername":"12312",
    //      "touserid":"94b806f846cf4fdb8707b4f66015be44","tousername":"ss","touserrole":"student",
    //      "msg":"12312","time":"15:57:32"}
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: '管理员',
        toUserName: data.tousername,
        content: showEm(data.msg),
    }));

    chatScroll();
}

// 提问
function on_cc_live_qa_question(data) {
    //{"action":"question","time":-1,
    //      "value":{"userId":"94b806f846cf4fdb8707b4f66015be44","userName":"ss","content":"12312","id":"7FA2E5086C04DA61"}}
    var question = data.value;
    $("#qas").append(Template.question({
        id: question.id,
        questionUserId: question.userId,
        questionUserName: question.userName,
        content: question.content,
    }));

    qaScroll();
}

// 回答
function on_cc_live_qa_answer(data) {
    //{"action":"answer","time":-1,"value":
    //      {"questionId":"7FA2E5086C04DA61","content":"111111","isPrivate":0,
    //      "userId":"d0d359766d694d0aa0e778094ff7d892","userName":"12312","questionUserId":"94b806f846cf4fdb8707b4f66015be44"}}

    var answer = data.value;
    // 私密回答只能自己看
    if (answer.isPrivate) {
        return;
    }

    $("#" + answer.questionId).append(Template.answer({
        answerUserName: answer.userName,
        content: answer.content,
        isFromMe: Viewer.isMe(answer.questionUserId)
    })).attr('isAnswer', 1);

    var isOnlyMyOwnQas = $(this).find('i').hasClass('active');
    if (isOnlyMyOwnQas && !Viewer.isMe(answer.questionUserId)) {
        return;
    }
    $("#" + answer.questionId).show();

    qaScroll();
}

var Template = {
    init: function () {
        if($("#chatMsgTemplate").length){
            this.chatMsg = Handlebars.compile($("#chatMsgTemplate").html());
        }
        if($("#privateChatMsgTemplate").length){
            this.privateChatMsg = Handlebars.compile($("#privateChatMsgTemplate").html());
        }
        if($("#questionTemplate").length){
            this.question = Handlebars.compile($("#questionTemplate").html());
        }
        if($("#answerTemplate").length){
            this.answer = Handlebars.compile($("#answerTemplate").html());
        }
    }
};


var Viewer = {
    id: $('#viewerId').val(),
    name: $('#viewerName').val(),
    role: $('#viewerRole').val(),
    sessionId: $.cookie('sessionid'),
    isMe: function (viwerId) {
        return viwerId == this.id;
    }
};

function chatScroll() {
    $("#chat-list").parent().scrollTop($("#chat-list").height());
}

function qaScroll() {
    $("#qas").parent().scrollTop($("#qas").height());
}