function notify(resp) {
	// This creates the notification alert on a 'paused' app
	notification = Ti.App.iOS.scheduleLocalNotification({
		alertBody : resp,
		alertAction : "OK",
		userInfo : {
			"Radler" : "in Bewegung"
		},
		badge : alertCount,
		date : new Date(new Date().getTime() + 10)
	});
}
var getPosition =function(e) {
	console.log('Info: start getPosition');
	Ti.Geolocation.removeEventListener('location', getPosition);
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))({
		ononline : function() {
			Ti.App.Apiomat.loginUser(null, {
				onOk : function() {
					console.log('Info: sending position to cloud');
					Ti.App.Apiomat.setPosition({
						latitude : e.coords.latitude,
						longitude : e.coords.longitude
					});
				}
			});
		},
		onoffline : function() {
		}
	});
};

function checkLocation() {
	console.log('Info: start checkLocation');
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 50;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	if (!Ti.Android)
		Ti.Geolocation.trackSignificantLocationChange = true;
	Ti.Geolocation.addEventListener('location', getPosition);
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