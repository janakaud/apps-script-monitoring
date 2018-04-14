function sendsms() 
{
	var label = GmailApp.getUserLabelByName('sendsms');
	var threads = label.getThreads();
	if(threads.length < 1) //nothing new
		return;

	var allMsgs = threads[0].getMessages();
	var message = allMsgs[allMsgs.length - 1]; //last message
	
	//don't resend read messages
	if(message.isUnread()) {
		var now = new Date().getTime();
		var cal = CalendarApp.getOwnedCalendarsByName('sendsms')[0];
		
		cal.createEvent(threads[0].getFirstMessageSubject()+": "+threads[0].getMessages()[0].getFrom(),
			new Date(now+60000),new Date(now+60000));
		message.markRead();
	}
	
	//remove label, whether notification was sent or not
	label.removeFromThread(threads[0]);
}