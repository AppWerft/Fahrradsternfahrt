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

exports.start = function() {
	if (Ti.Android) {
		var alarmModule = require('bencoding.alarmmanager');
		var alarmManager = alarmModule.createAlarmManager();
		alarmManager.addAlarmService({
			service : 'de.appwerft.fahrradsternfahrt.Geo_serviceService',
			minute : 1,
			interval : 300000
		});
	}
	else if (isiOS4Plus()) {
		Ti.App.addEventListener('resume', function(e) {
			Ti.API.info("app is resuming from the background");
		});
		Ti.App.addEventListener('resumed', function(e) {
			Ti.API.info("app has resumed from the background");
			if (service != null) {
				service.stop();
				service.unregister();
			}
		});
		Ti.App.addEventListener('pause', function(e) {
			Ti.API.info("app was paused from the foreground");
			service = Ti.App.iOS.registerBackgroundService({
				url : 'geo.service.js'
			});
			Ti.API.info("registered background service = " + service);
		});
	}
};
