module.exports = function() {
	var e = (new Date).getTime(), t = Ti.App.Properties.getString("RemindToRate");
	if (t) {
		if (e > t) {
			var r = Ti.UI.createAlertDialog({
				title : "Bitte bewerte diese App!",
				message : "Möchtest Du jetzt FreeJosef bewerten?",
				buttonNames : ["OK", "Erinnere mich später", "Nie wieder"],
				cancel : 2
			});
			r.addEventListener("click", function(t) {
				switch(t.index) {
					case 0:
						Ti.App.Properties.setString("RemindToRate", Number.MAX_VALUE), Ti.Platform.openURL(Ti.Android ? "https://play.google.com/store/apps/details?id=de.appwerft.freedom4josef" : "URL TO YOUR APP IN THE ITUNES STORE");
						break;
					case 1:
						Ti.App.Properties.setString("RemindToRate", e + 864e5);
						break;
					case 2:
						Ti.App.Properties.setString("RemindToRate", Number.MAX_VALUE);
				}
			}), r.show();
		}
	} else
		Ti.App.Properties.setString("RemindToRate", e);
}; 