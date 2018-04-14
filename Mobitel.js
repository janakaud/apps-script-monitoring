function checkBal() {
  var n = new Navigator.Navigator("https://sc.mobitel.lk/");
  n.setSaveCookies(false);
  n.setLoginPath("MyAccount/login.jsp");

  s = n.doGet("MyAccount/login.jsp");
  s = n.doPost("https://accounts.mobitel.lk/commonauth", {
    username: "__user__",
    password: "__password__",
    sessionDataKey: Navigator.getFormParam(s, "sessionDataKey")
  });
  s = n.doPost("MyAccount/Home", {
    SAMLResponse: Navigator.getFormParam(s, "SAMLResponse"),
    RelayState: Navigator.getFormParam(s, "RelayState"),
  });
  n.doPost("MyAccount/proceedSelectedMobile.action", {
    selectedMobile: "__number__",
    as_sfid: Navigator.getFormParam(s, "as_sfid"),
    as_fid: Navigator.getFormParam(s, "as_fid")
  });

  p = n.cookie.indexOf("JSESSIONID=") + 11;
  if (p < 11) throw new Error("Missing JSESSIONID");
  s = n.doPost("MyAccount/dwr/call/plaincall/dashboardDetailsAJAX.packagedetailsPrepaid.dwr", "callCount=1\n\
page=/MyAccount/individual_prepaid.jsp\n\
httpSessionId=" + n.cookie.substring(p, n.cookie.indexOf(";", p)) + "\n\
scriptSessionId=DCD7FA4BACF0E623C0CDEF7090232128515" + Math.floor(Math.random() * 1000) + "\n\
c0-scriptName=dashboardDetailsAJAX\n\
c0-methodName=packagedetailsPrepaid\n\
c0-id=0\n\
batchId=10");

  bal = parseFloat(JSON.parse(s.match(/\[.*\]/)[0])[0]);
  Logger.log(bal);
  if (bal < 300) sendTweet("Mobitel " + bal);	//TODO change this to email, webhook, whatever
}
