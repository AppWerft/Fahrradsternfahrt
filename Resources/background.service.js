module.exports= function() {
	var service;
	function isiOS4Plus() {
		if (Ti.App.iOS) {
			var version = Ti.Platform.version.split(".");
			var major = parseInt(version[0]);
			if (major >= 4) {
				return true;
			}
		}
		return false;
	}

	if (Ti.Android) {
		var alarmModule = require('bencoding.alarmmanager');
		var alarmManager = alarmModule.createAlarmManager();
		alarmManager.addAlarmService({
			service : 'de.appwerft.fahrradsternfahrt.Geo_serviceService',
			minute : 1,
			interval : 60000
		});

	} else if (isiOS4Plus()) {
		/*
		Ti.App.addEventListener('resume', function(e) {
			Ti.API.info("app is resuming from the background");
		});
		Ti.App.addEventListener('resumed', function(e) {
			if (service != null) {
				service.stop();
				service.unregister();
			}
		});
		Ti.App.addEventListener('pause', function(e) {
			service = Ti.App.iOS.registerBackgroundService({
				url : 'geo.service.js'
			});
		});*/
	}
};
