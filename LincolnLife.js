var COURSE = "https://lincolnlifecenter.com/course/view.php?id=26";
var LOGIN = "https://lincolnlifecenter.com/login/index.php";
var EMAIL = "__email__";

var props = PropertiesService.getScriptProperties();

function lincolnLife() {
	//login to site
	var login = getCourse();
	var prevLen = props.getProperty("prevPageLen");
	
	//visit URL extracted from course page
	var urlPos = login.page.indexOf("https://swanson.lincolnlifecenter.com/turningpoint.php?");
	var url = login.page.substring(urlPos, login.page.indexOf("\"", urlPos));
	var response = UrlFetchApp.fetch(url, {
		referer: COURSE,
		headers: {cookie: login.cookie}
	});
	
	//check page length
	var page = response.getContentText();
	var pageLen = page.length;
	if (pageLen != prevLen) {
		props.setProperty("prevPageLen", pageLen);
		GmailApp.sendEmail(EMAIL, "LincolnLifeCenter: TurningPoint Updated", "Page content length changed from " + 
			prevLen + " to " + pageLen + ". View as HTML to see new content.", {htmlBody: page});
	}
}

function getCourse() {
	// try using old cookie
	var cookie = props.getProperty("cookie");
	if(!cookie) {
		cookie = "";
		var response = UrlFetchApp.fetch(COURSE);
	} else {
		var response = UrlFetchApp.fetch(COURSE, {
			referer: LOGIN,
			headers: {cookie: cookie}
		});
	}
	cookie = updateCookies(cookie, response.getAllHeaders()['Set-Cookie']);
	var str = response.getContentText();
	
	// if we got error, need to log in and refresh cookies
	if(str.indexOf("Log in to the site") > 0 || str.indexOf("This page should automatically redirect") > 0) {
		response = UrlFetchApp.fetch(LOGIN);
		cookie = updateCookies(cookie, response.getAllHeaders()['Set-Cookie']);
		response = UrlFetchApp.fetch(LOGIN, {
			method: "POST",
			referer: LOGIN,
			headers: {
				cookie: cookie
			},
			payload: {
				username: "__email__",
				password: "__password__",
				rememberusername: "1"
			},
			followRedirects: false
		});
		cookie = updateCookies(cookie, response.getAllHeaders()['Set-Cookie']);
		props.setProperty("cookie", cookie);	// update cookie store

		//revisit required page
		response = UrlFetchApp.fetch(COURSE, {
			referer: LOGIN,
			headers: {cookie: cookie}
		});
		str = response.getContentText();
	}
	return {
		page: str,
		cookie: cookie
	};
}

function updateCookies(cookie, rawCook) {
	if (!rawCook)
		return cookie;
	if (!(rawCook instanceof Array)) {
		rawCook = [rawCook];
	}
	for (var i in rawCook) {
		var cookieName = rawCook[i].substring(0, rawCook[i].indexOf('='));
		var pos = cookie.indexOf(cookieName);
		if (pos >= 0) { // replace
			var endPos = cookie.indexOf(';', pos)
			if (endPos < 0)
				endPos = cookie.length;
			cookie = cookie.substring(0, pos) + rawCook[i].substring(0, rawCook[i].indexOf(';')) + cookie.substring(endPos);
		}
		else {			// append
			if (cookie.length > 0)
				cookie += '; ';
			cookie += rawCook[i].substring(0, rawCook[i].indexOf(';'));
		}
	}
	return cookie;
}