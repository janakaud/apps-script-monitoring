function doGet(request) {
	if (request.parameters.tweet) {
		result = sendTweet("" + request.parameters.tweet);
	} else if (request.parameters.del) {
		result = deleteTweets();
	} else if (request.parameters.offers) {
		prop = PropertiesService.getScriptProperties();
		result = JSON.parse(prop.getProperty("savedOffers") || "[]").join("\n\n\n");
		prop.deleteProperty("savedOffers");
	} else if (request.parameters.pause) {
		min = ("" + request.parameters.pause);
		type = "pause" + (request.parameters.type || "offers");
		CacheService.getScriptCache().put(type, new Date().getTime() + min * 60000);
		result = type + " for " + min + " min";
	} else if (request.parameters.unpause) {
		type = "pause" + (request.parameters.type || "offers");
		CacheService.getScriptCache().remove(type);
		result = type + " off";
	} else if (request.parameters.offers_force) {
		result = checkOffers(true);
	} else if (request.parameters.offers_cookie) {
		PropertiesService.getScriptProperties().setProperty("offers_cookie", "" + request.parameters.offers_cookie);
		result = checkOffers(true);
	}
	return ContentService.createTextOutput(result);
}
