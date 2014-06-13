function notify(resp) {
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

var getPosition = function(e) {
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
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 150;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	if (!Ti.Android)
		Ti.Geolocation.trackSignificantLocationChange = true;
	Ti.Geolocation.addEventListener('location', getPosition);
}

if (Ti.App.Properties.hasProperty('RECORD')) {
	if (Ti.Android) {
		var service = Ti.Android.currentService;
		var intent = service.getIntent();
		checkLocation();
	} else {
		Ti.App.iOS.addEventListener('notification', function() {
			Ti.App.currentService.stop();
			Ti.App.currentService.unregister();
		});
		var timer = setInterval(checkLocation, 60000);
	}
}