Ti.Map = require('ti.map');
exports.get = function() {
	if (Ti.Map.isGooglePlayServicesAvailable() == Ti.Map.SUCCESS) {
		var r = Ti.UI.createAlertDialog({
			buttonNames : ["Playstore"],
			message : "Du solltest Google Playservice installieren oder erneuern.",
			title : "Google Playservice"
		});
		r.addEventListener("click", function(_t) {
			if (_t.index >= 0)
				Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.google.android.gms&hl=de');
		}), r.show();

	}
};
