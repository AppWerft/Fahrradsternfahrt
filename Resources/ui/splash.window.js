module.exports = function(_callback) {
	if (!Ti.Android) {
		_callback();
		return true;
	}
	Ti.Map = require('ti.map');
	if (Ti.Map.isGooglePlayServicesAvailable() == Ti.Map.SUCCESS) {
		_callback();
		return true;
	}
	var self = require('vendor/window').create();
	//self.navBarHidden=true;
	self.backgroundImage = '/assets/default.png';
	self.add(Ti.UI.createLabel({
		bottom : 10,
		text : 'Teste, ob GooglePlayServive passt …',
		height : 50,
		color : 'white',
		font : {
			fontWeight : 'bold'
		}
	}));
	self.open();
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
		color : 'black',
		text : "Für die Kartendarstellung brauchts die Google Playdienste. Der fehlt auf dem Gerät oder ist in falscher Version.",
		textAlign : 'left',
		left : 120
	}));
	self.dialog = Ti.UI.createAlertDialog({
		buttonNames : ["Playdienste installieren"],
		androidView : androidview,
		title : "Google Playdienste für Karte"
	});
	self.dialog.addEventListener("click", function(_t) {
		if (_t.index >= 0)
			Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.google.android.gms&hl=de');
		//_callback();
	});
	self.dialog.show();
};
