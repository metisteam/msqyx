$(function(){

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

	// 开始直播后显示公告
	DWLive.onAnnouncementShow = function (j) {
		console.log(j);
	};

	// 修改公告,发布公告
	DWLive.onAnnouncementRelease = function (j) {
		console.log(j);
	};

	// 删除公告
	DWLive.onAnnouncementRemove = function (j) {
		console.log(j);
	};

	// 接收公聊
	DWLive.onPublicChatMessage = function(j){
		var o = JSON.parse(j);
		var d = '<li name="' + o.username + '">'
					+'<div class="peo-infos">'
					+	'<p class="peo-names">'
					+		'<span class="p-n-names">' + o.username + '</span>'
					+		'<i class="peo-icons "></i>'
					+	'</p>'
					+'</div>'
					+'<div class="peo-chat">'
					+	'<i class="icons"></i>'
					+	'<p class="chat-content">' + showEm(o.msg) + '</p>'
					+'</div>'
				+'</li>';
		$("#chat-list").append(d);

		$("#chat-list").parent().scrollTop($("#chat-list").height());

		if(o.username == DWLive.viewername){
			$("#chat-list li[name = " + o.username + "]").addClass("me");
		}

		DWLive.barrage(o.msg); // 发送弹幕
	}

	// 接收私聊
	DWLive.onPrivateChatMessage = function(j){
		var o = JSON.parse(j);
		var d = '<li name="' + o.username + '">'
					+'<div class="peo-infos">'
					+	'<p class="peo-names">'
					+		'<span class="p-n-names">' + o.username + '&nbsp;对&nbsp;老师&nbsp;说</span>'
					+		'<i class="peo-icons "></i>'
					+	'</p>'
					+'</div>'
					+'<div class="peo-chat">'
					+	'<i class="icons"></i>'
					+	'<p class="chat-content pchat">' + showEm(o.msg) + '</p>'
					+'</div>'
				+'</li>';
		$("#chat-list").append(d);

		$("#chat-list").parent().scrollTop($("#chat-list").height());

		if(o.username == DWLive.viewername){
			$("#chat-list li[name = " + o.username + "]").addClass("me");
		}
	}

	// 接收私聊回复
	DWLive.onPrivateAnswer = function(j){
		var o = JSON.parse(j);
		var d = '<li name="' + o.fromusername + '">'
					+'<div class="peo-infos">'
					+	'<p class="peo-names">'
					+		'<span class="p-n-names">老师&nbsp;对&nbsp;' + o.tousername + '&nbsp;说</span>'
					+		'<i class="peo-icons "></i>'
					+	'</p>'
					+'</div>'
					+'<div class="peo-chat">'
					+	'<i class="icons"></i>'
					+	'<p class="chat-content pchat">' + showEm(o.msg) + '</p>'
					+'</div>'
				+'</li>';
		$("#chat-list").append(d);

		$("#chat-list").parent().scrollTop($("#chat-list").height());

	}


	// 提问
	DWLive.onQuestion = function(j){
		var o = JSON.parse(j);
		var qid = o.value.id; 

		var d = '<li id="' + qid + '">'
				+	'<div class="peo-infos">'
				+		'<p class="peo-names">'
				+			'<span class="p-n-names">' + o.value.userName + '</span>'
				+			'<i class="peo-icons"></i>'
				+		'</p>'
				+	'</div>'
				+	'<div class="peo-chat">'
				+		'<p class="chat-content">' + o.value.content + '</p>'
				+	'</div>'
				+'</li>';
		$("#question-main").append(d);
		$("#question-main").parent().scrollTop($("#question-main").height());

		if(o.value.userName !== DWLive.viewername){
			$("#" + qid).addClass("not-mines");
		}
	}

	// 接收回答
	DWLive.onAnswer = function(j){
		var o = JSON.parse(j);
		var answer = o.value;

		// 私密回答只能自己看
		if (answer.questionUserId !== DWLive.userid && answer.isPrivate) {
			return;
		}

		var qid = o.value.questionId;
		var d = 	'<div class="peo-repeat">'
				+		'<p class="teacher-name">'
				+			'<i></i>' + o.value.userName + ''
				+		'</p>'
				+		'<p class="repeat-content">' + o.value.content + '</p>'
				+	'</div>';
		$("#" + qid).append(d).show();
		$("#question-main").parent().scrollTop($("#question-main").height());
	}

	// 禁言
	DWLive.onInformation = function(j){
		var chat = $('#chat-content'),
            chatX = chat.offset().left,
            chatY = chat.offset().top;
        tips(chatX, chatY, '您已经被禁言！');
		return;
	}

	var chatTime = 0;
	function chatSend(){
		
		if(chatTime > 0){
			return;
		}else{
			chatTime = 10;
			var t = setInterval(function() { 
				$('#chat-submit').html(chatTime);
				chatTime--;
				if(chatTime <= 0){
					$('#chat-submit').html('发送');
					clearInterval(t);
				}
		     }, 1000);
		}
		
		var msg = Tools.formatContent($.trim($("#chat-content").html()));

        if(!msg){
        	var chat = $('#chat-content'),
	            chatX = chat.offset().left,
	            chatY = chat.offset().top;
            tips(chatX, chatY, '请输入您的聊天内容！');
			return;
		}

		if (msg.length > 300) {
			tips(chatX, chatY, '聊天不能超过300个字符');
			return;
		}

		if ($('#to-teacher').attr('for') === 'all') {
			
			DWLive.sendPublicChatMsg(msg); // 发送公聊

		} else {

			DWLive.sendPrivateChatMsg(msg); // 发送私聊
		}

		$("#chat-content").html('').focus();
	};

	$("#chat-submit").click(function(){
		chatSend();
	});

	$('#chat-content').bind('keypress', function(e) {
		if (e.keyCode == 13) {
			chatSend();
		}
	});

	function qaSend(){
		var qa = $('#question-content');
		var msg = Tools.formatContent($.trim(qa.html()));
		var chatX = qa.offset().left,
		    chatY = qa.offset().top;

		if(!msg){
	        tips(chatX, chatY, '请输入您的问题！');
			return;
		}

		if (msg.length > 300) {
			tips(chatX, chatY, '问题不能超过300个字符');
			return;
		}

		DWLive.sendQuestionMsg(msg); // 发送问题

		$("#question-content").html('').focus();
	};

	$("#question-submit").click(function(){
		qaSend();
	});

	$('#question-content').bind('keypress', function(e) {
		if (e.keyCode == 13) {
			qaSend();
		}
	});

	function tips(chatX, chatY, msg){
    	$('#input-tips').find('p').text(msg);
    	$('#input-tips').css({'left':chatX,'top':(chatY-42)}).stop(1,1).fadeIn(200).delay(1500).fadeOut(200);
	}

	//对老师说
    $('#to-teacher').bind('click',function(){
        if(!$(this).find('i').hasClass('active')){
        	$(this).find('i').addClass('active');
        	$(this).attr('for', 'teacher');
        }else{
        	$(this).find('i').removeClass('active');
        	$(this).attr('for', 'all');
        }
    });

})


