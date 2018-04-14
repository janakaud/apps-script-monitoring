function Gmail2Twitter() {
	var label = GmailApp.getUserLabelByName('sendsms');
	var threads = label.getThreads();
	if (threads.length < 1) { //nothing new
		return;
	}

	var allMsgs = threads[0].getMessages();
	var message = allMsgs[allMsgs.length - 1]; //last message
	label.removeFromThread(threads[0]);	//remove label, whether tweet was sent or not
	if (!message.isUnread()) {	//don't resend read messages
		return;
	}

	var text = message.getPlainBody() || message.getBody();
	var start = text.indexOf(' left you ');
	if (start > 0 && text.indexOf('you signed up for Fiverr') > 0) {	//from Fiverr
		//find sender
		start = text.lastIndexOf('\n', start) + 1;
		var sender = text.substring(start, text.indexOf(' ', start));
		//remove tags and trim as much as possible
		start = text.indexOf('\n', start) + 1;
		text = sender + '\n' + text.substring(start, text.lastIndexOf('View and Reply')).trim().replace(/<[^>]+>/g, '').replace(/&\S+;/g, '');
	}

	text = text.replace(/[\r\n\s]{2,}/g, ' ');
	if (text.length <= 140) {
		message.markRead();	//whole message is sent in tweet; mark as read
	} else {
		text = text.substring(0, 140);
	}
	sendTweet(text);
}