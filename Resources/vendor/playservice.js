exports.start = function() {
	Ti.Map = require('ti.map');
	console.log('Info: playservicetest started');
	if (Ti.Map.isGooglePlayServicesAvailable() != Ti.Map.SUCCESS) {
		var androidview = Ti.UI.createView({});
		androidview.add(Ti.UI.createImageView({
			image : '/assets/googleplay.png',
			width : 100,
			height : 100,
			left : 5,
			top : 5
		}));
		androidview.add(Ti.UI.createLabel({
			color : 'white',
			top : 5,
			bottom : 5,
			right : 5,
			text : "Für die Kartendarstellung brauchts die Google Playdienste. Der fehlt auf dem Gerät oder ist in falscher Version.",
			textAlign : 'left',
			left : 120
		}));
		var self = Ti.UI.createAlertDialog({
			buttonNames : ["Playdienste installieren"],
			androidView : androidview,
			title : "Google Playdienste für Karte"
		});
		self.addEventListener("click", function(_t) {
			if (_t.index >= 0)
				Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.google.android.gms&hl=de');
		}), self.show();

	}
};
