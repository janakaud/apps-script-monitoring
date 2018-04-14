WHITELIST = /script|apps?\s*script|app\s*engine|GAS|GAE|integrat|collect|scrap|extract|connect|debug|macro|vba|python|\bc\b|c\+\+|js|java\s?script|\bbots?\b|automat|shell|\bsh\b/i;
BLACKLIST = /wordpress|joomla|minecraft|matlab|rails|\bRoR\b|skype|moodle|youtube|unity|\b(pic|mt4|psd|ea)\b/i;
MAX = 15;
THREE_DAYS = 3*86400*1000;

function checkOffers(force) {
  now = new Date();
  day = now.getDay();
  if (force != true && !(day == 6 || day == 0 || (day == 5 && now.getHours() > 18))) {
    return;
  }

  pauseEnd = CacheService.getScriptCache().get("pauseoffers");
  if (pauseEnd && parseInt(pauseEnd) > now.getTime()) {
    return;
  }

  props = PropertiesService.getScriptProperties();
  news = {};
  savedLastId = savedLastDay = details = null;

  rows = [];
  saveDay = saveId = null;
  for (p = 1; ; p++) {
    u = UrlFetchApp.fetch("https://www.fiverr.com/users/__username__/requests?per_page=10&page=" + p, {
      headers: {
        cookie: "hodor_creds=__your hodor_creds cookie (from browser) here__",
        Accept: "text/javascript"
      }
    });
    rows = JSON.parse(u.getContentText()).results.rows;
    if (rows.length < 1) {
      break;
    }

    veryOld = true;
    lastIdFound = false;
    for (i in rows) {
      row = rows[i];
      cells = row.cells;
      id = cells[4].buttons[1].meta.requestId;
      date = Date.parse(cells[0].text);
      detail = cells[2].text;

      if (!savedLastDay) {
        savedLastDay = props.getProperty("savedLastDay") || 1501596551022; // Aug 1, 2017
        savedLastId = props.getProperty("savedLastId") || null;
      }

      lastIdFound |= savedLastId == id;
      oldEntry = date < savedLastDay;
      veryOld &= oldEntry; // not "old" if at least 1 new listing exists on current page
      if (oldEntry) {
        continue;
      }
      if (lastIdFound) {
        break;
      }

      if (!saveDay || date > saveDay) { // update marker
        saveDay = date;
        saveId = id;
      }

      matches = detail.match(WHITELIST);
      offers = cells[3].text;
      if (matches && !detail.match(BLACKLIST) && offers < MAX) {
        match = matches[0].toLowerCase();
        slot = news[match];
        if (!slot) {
          slot = news[match] = [];
        }
        slot.push(Number(offers).toString(16));
        if (!details) {
          details = JSON.parse(props.getProperty("savedOffers") || "[]");
        }
        details.splice(0, 0, offers + "\n" + detail);
      }
    }

    if (veryOld || lastIdFound) { // no use of proceeding further
      break;
    }
  }

  if (saveDay) {
    props.setProperties({savedLastDay: saveDay, savedLastId: saveId});
  }

  if (!details) {
    return;
  }

  if (now - savedLastDay > THREE_DAYS) {
    GmailApp.sendEmail("__email__", "Offers", details.join("\n\n\n"));
  } else if (details.length > 0 && details.length < 3 && (detailStr = details.join("\n")).length <= 140) { // directly send offer details if possible
    sendTweet(detailStr);
  } else if (Object.keys(news).length > 0) { // send summary
    output = [];
    for (s in news) {
      output.push(s + " " + news[s]);
    }
    sendTweet(output.join("\n"));
  }

  // flush mismatches if too long
  detailJson = JSON.stringify(details);
  while (detailJson.length > 8192) {
    details.pop();
    detailJson = JSON.stringify(details);
  }
  props.setProperty("savedOffers", detailJson);
  return details.length;
}
