function login() {
  var n = new Navigator.Navigator("https://www.fiverr.com/");
  n.setSaveCookies(true);
  n.setCookieUsername("__username__");
  n.setDebug(true);
  n.setLoginPath("login");

  var s = n.doGet("login");
  var p = n.doPost("report_payload_counter", '{"items":[{"facility":"aux_data","label":"login_click","value":1},{"facility":"graphite","type":"long_counter","label":"signing_event.{platform}.{browser}.form_interaction.login_click","value":1},{"facility":"aux_data","label":"reg_from_popup","value":1},{"facility":"graphite","type":"long_counter","label":"signing_event.{platform}.{browser}.form_interaction.reg_from_popup","value":1}]}', {
      "X-CSRF-Token": Navigator.extractReverse(s, "content", 'itemprop="csrf-token"'),
      "Accept": "text/javascript",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Connection": "keep-alive",
      "Accept-Encoding": "gzip, deflate, br"
    });
  var payload = "utf8=%E2%9C%93&authenticity_token=" + encodeURIComponent(Navigator.getFormParam(s, 'name="authenticity_token"')) +
    "&timestamp=" + Navigator.getFormParam(s, 'name="timestamp"') + "&spinner=" + Navigator.getFormParam(s, "spinner") + "&" +
    Navigator.extract(s, "name", "js-form-login") + "=__username__&login=&" + Navigator.extract(s, "name", "js-form-password") +
    "=__password__&password=&user_session%5Bremember_me%5D=1";
  s = n.doPost("user_sessions", payload, {
      "Origin": "https://www.fiverr.com",
      "X-CSRF-Token": Navigator.extractReverse(s, "content", 'itemprop="csrf-token"'),
      "Accept": "text/javascript",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Connection": "keep-alive",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.71 Safari/537.36"
    });
Logger.log(s);
return;
}

