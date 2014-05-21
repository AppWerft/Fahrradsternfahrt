exports.start = function() {
	var url = "https://play.google.com/store/apps/details?id=" + Ti.App.getId();
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var t = /itemprop="softwareVersion">(.*?)</m.exec(this.responseText);
			if (t && ( version = t[1].replace(/\s+/g, "")) != Ti.App.getVersion()) {
				var r = Ti.UI.createAlertDialog({
					cancel : 1,
					buttonNames : ["Zum Store", "Abbruch"],
					message : "Es gibt eine neue Version (" + version + ") im Playstore.",
					title : "Neue Version"
				});
				r.addEventListener("click", function(_t) {
					if (_t.index != _t.source.cancel)
						Ti.Platform.openURL(url);
				}), r.show();
			} else
				Ti.Android && Ti.UI.createNotification({
					message : Ti.App.getName() + " ist in neuester Version (" + Ti.App.getVersion() + ")"
				}).show();
		}
	});
	xhr.open("GET", url), xhr.send();
};
