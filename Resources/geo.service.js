var service = Ti.Android.currentService;
var intent = service.getIntent();

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 100;
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
