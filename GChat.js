function doGet(request) {
  start = 0;
  if (request.parameters.start)
    start = request.parameters.start;
  max = 10;
  if (request.parameters.max)
    max = request.parameters.max;
  
  chats = GmailApp.getChatThreads(start, max);
  output = "";
  for (i in chats) {
    msgs = chats[i].getMessages();
    msg = msgs[msgs.length - 1];
    output += msg.getFrom() + "\n\t" + msg.getBody() + "\n\n";
  }
  
  if (output == "")
    output = "No unread";
  return ContentService.createTextOutput(output);
}