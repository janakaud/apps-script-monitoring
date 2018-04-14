function BIC() {
  PROPS = PropertiesService.getScriptProperties();
  nav = new Navigator.Navigator("http://www.buyincoins.com");
  nav.setLoginPath("");
  nav.setLogoutIndicator("~~~~~");
  url = nav.doGet("").match(/(lp|\?r=specialTopic)\/[^"]*/)[0];
  if (url != PROPS.getProperty("bic_latest")) {
    GmailApp.sendEmail("__email__", "BIC Update", url);
    PROPS.setProperty("bic_latest", url);
  }
}