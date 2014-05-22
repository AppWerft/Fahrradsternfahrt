function notify(resp) {
	// This creates the notification alert on a 'paused' app
	notification = Ti.App.iOS.scheduleLocalNotification({
		alertBody : resp,
		alertAction : "OK",
		userInfo : {
			"hello" : "world"
		},
		badge : alertCount,
		date : new Date(new Date().getTime() + 10)
	});
}

function checkLocation() {
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 100;
	Ti.Geolocation.trackSignificantLocationChange = true;
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
			} else {
				Ti.App.Apiomat.setPosition({
					latitude : e.coords.latitude,
					longitude : e.coords.longitude
				});
			}
		});
	}
}

if (Ti.Android) {
	var service = Ti.Android.currentService;
	var intent = service.getIntent();
	checkLocation();
} else {
	Ti.App.iOS.addEventListener('notification', function() {
		Ti.API.info('background event received = ' + notification);
		Ti.App.currentService.stop();
		Ti.App.currentService.unregister();
	});
	var timer = setInterval(checkLocation, 60000);
}