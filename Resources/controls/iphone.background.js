function isiOS4Plus() {
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0]);
		if (major >= 4) {
			return true;
		}
	}
	return false;
}
var service;

exports.create = function() {
	if (isiOS4Plus()) {
		Ti.App.addEventListener('resume', function(e) {
			Ti.API.info("app is resuming from the background");
		});
		Ti.App.addEventListener('resumed', function(e) {
			Ti.API.info("app has resumed from the background");
			if (service != null) {
				service.stop();
				service.unregister();
			}
			//Titanium.UI.iPhone.appBadge = null;
		});

		Ti.App.addEventListener('pause', function(e) {
			Ti.API.info("app was paused from the foreground");

			service = Ti.App.iOS.registerBackgroundService({
				url : 'bg.js'
			});
			Ti.API.info("registered background service = " + service);

		});
	}
}; 